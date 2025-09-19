import { BadRequestException, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { RedisService } from 'src/common/redis/redis.service';
import { UserService } from 'src/modules/users/users.service';
import { GenerateTokenFactory } from '../jwt/jwt.service';
import { User } from 'src/modules/users/entity/user.entity';
import { AuthResponse } from '../dto/AuthRes.dto';
import { LoginDto } from '../inputs/Login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../inputs/CreateUserData.dto';
import { CreateImagDto } from 'src/common/upload/dtos/createImage.dto';
import { SendWelcomeEmailCommand } from '../command/auth.command';
import { SendEmailService } from 'src/common/queues/email/sendemail.service';
import { UploadService } from 'src/common/upload/upload.service';
import { Role } from 'src/common/constant/enum.constant';
import { PasswordValidator, RoleValidator } from '../chain/auth.chain';
import { PasswordServiceAdapter } from '../adapter/password.adapter';
import { UserProxy } from 'src/modules/users/proxy/user.proxy';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class AuthServiceFacade {
  private proxy: UserProxy;

  constructor(
    private readonly i18n: I18nService,
    private readonly userService: UserService,
    private readonly tokenFactory: GenerateTokenFactory,
    private readonly passwordAdapter: PasswordServiceAdapter,
    private readonly redisService: RedisService,
    private readonly uploadService: UploadService,
    private readonly emailService: SendEmailService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    this.proxy = new UserProxy(this.i18n, this.redisService, this.userRepo);
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    const user = await this.createUser(createUserDto);

    const tokenService = await this.tokenFactory.createTokenGenerator();
    const token = await tokenService.generate(user.email, user.id);

    this.redisService.set(`user:${user.id}`, user);
    this.redisService.set(`user:email:${user.email}`, user);

    const emailCommand = new SendWelcomeEmailCommand(
      this.emailService,
      user.email,
    );
    emailCommand.execute();

    return {
      data: {
        user,
        token,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const userCacheKey = `auth:${loginDto.email}`;
    const cachedUser = await this.redisService.get(userCacheKey);

    if (cachedUser instanceof AuthResponse) {
      return { ...cachedUser };
    }

    const { email, password, fcmToken } = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new BadRequestException(await this.i18n.t('user.NOT_FOUND'));

    const isValid = await this.passwordAdapter.compare(
      password,
      user.data.password,
    );
    if (!isValid) throw new BadRequestException('Invalid credentials');

    const tokenGenerator = await this.tokenFactory.createTokenGenerator();
    const token = await tokenGenerator.generate(user.data.email, user.data.id);

    user.data.fcmToken = fcmToken;
    this.userRepo.save(user.data);

    this.redisService.set(`user:${user.data.id}`, user);
    return {
      data: { user: user.data, token },
      message: await this.i18n.t('user.LOGIN'),
    };
  }

  async roleBasedLogin(
    fcmToken: string,
    loginDto: LoginDto,
    role: Role,
  ): Promise<AuthResponse> {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);

    const passwordValidator = new PasswordValidator(
      this.i18n,
      this.passwordAdapter,
      password,
    );
    const roleValidator = new RoleValidator(this.i18n, role);

    passwordValidator.setNext(roleValidator);
    await passwordValidator.validate(user.data);

    const tokenService = await this.tokenFactory.createTokenGenerator();
    const token = await tokenService.generate(user.data.email, user.data.id);

    user.data.fcmToken = fcmToken;
    await this.userRepo.save(user.data);

    this.redisService.set(`user:${user.data.id}`, user);
    return {
      data: { user: user.data, token },
      message: await this.i18n.t('user.LOGIN'),
    };
  }

  @Transactional()
  private async createUser(createUserDto: CreateUserDto): Promise<User> {
    await this.proxy.dataExisted(
      createUserDto.email,
      createUserDto.phone,
      createUserDto.whatsapp,
      createUserDto.nationalId,
    );

    const password = await this.passwordAdapter.hash(createUserDto.password);

    let avatar = null;
    if (createUserDto.image)
      avatar = await this.handleAvatarUpload(createUserDto.image);

    const user = await this.userRepo.create({ ...createUserDto, password });
    await this.userRepo.save(user);

    // first account is admin
    const users = await this.userRepo.count();
    if (users === 1) {
      user.role = Role.ADMIN;
      await this.userRepo.save(user);
    }

    return user;
  }

  private async handleAvatarUpload(avatar: CreateImagDto): Promise<string> {
    const filename = await this.uploadService.uploadImage(avatar);
    return typeof filename === 'string' ? filename : '';
  }
}
