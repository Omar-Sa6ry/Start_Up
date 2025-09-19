import { RedisService } from 'src/common/redis/redis.service';
import { UserResponse, UsersResponse } from '../dto/UserResponse.dto';
import { I18nService } from 'nestjs-i18n';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entity/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Limit, Page } from 'src/common/constant/messages.constant';

export class UserProxy {
  constructor(
    private readonly i18n: I18nService,
    private readonly redisService: RedisService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findById(id: string): Promise<UserResponse> {
    const cacheKey = `user:${id}`;
    const cachedUser = await this.redisService.get(cacheKey);

    if (cachedUser) return { data: cachedUser as User };

    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(await this.i18n.t('user.NOT_FOUND'));

    this.redisService.set(cacheKey, user);
    this.redisService.set(`user:email:${user.email}`, user);

    return { data: user };
  }

  async findByEmail(email: string): Promise<UserResponse> {
    const cacheKey = `user:email:${email}`;
    const cachedUser = await this.redisService.get(cacheKey);

    if (cachedUser) return { data: cachedUser as User };

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException(await this.i18n.t('user.NOT_FOUND'));

    this.redisService.set(cacheKey, user);
    this.redisService.set(`user:id:${user.id}`, user);

    return { data: user };
  }

  async findUsers(
    page: number = Page,
    limit: number = Limit,
  ): Promise<UsersResponse> {
    const [items, total] = await this.userRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    if (items.length === 0)
      throw new NotFoundException(await this.i18n.t('user.NOT_FOUNDS'));

    return {
      items,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async phonenumberChecks(phone?: string, whatsapp?: string) {
    if (phone) {
      const phoneExised = await this.userRepo.findOne({ where: { phone } });
      if (phoneExised)
        throw new BadRequestException(await this.i18n.t('user.PHONE_EXISTED'));
    }

    if (whatsapp) {
      const whatsappExised = await this.userRepo.findOne({
        where: { whatsapp },
      });
      if (whatsappExised)
        throw new BadRequestException(
          await this.i18n.t('user.WHTSAPP_EXISTED'),
        );
    }
  }

  async dataExisted(
    email: string,
    phone: string,
    whatsapp: string,
    nationalId: string,
  ): Promise<void> {
    const cacheKey = `user:email:${email}`;
    const cachedUser = await this.redisService.get(cacheKey);

    if (cachedUser)
      throw new BadRequestException(await this.i18n.t('user.EMAIL_EXISTED'));

    const emailExised = await this.userRepo.findOne({ where: { email } });
    if (emailExised)
      throw new BadRequestException(await this.i18n.t('user.EMAIL_EXISTED'));

    const phoneExised = await this.userRepo.findOne({ where: { phone } });
    if (phoneExised)
      throw new BadRequestException(await this.i18n.t('user.PHONE_EXISTED'));

    const whatsappExised = await this.userRepo.findOne({ where: { whatsapp } });
    if (whatsappExised)
      throw new BadRequestException(await this.i18n.t('user.WHTSAPP_EXISTED'));

    const nationalIdExised = await this.userRepo.findOne({
      where: { nationalId },
    });
    if (nationalIdExised)
      throw new BadRequestException(
        await this.i18n.t('user.NATIONALID_EXISTED'),
      );
  }
}
