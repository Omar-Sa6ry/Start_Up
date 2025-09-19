import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../users/entity/user.entity';
import { AuthResponse } from './dto/AuthRes.dto';
import { CreateUserDto } from './inputs/CreateUserData.dto';
import { LoginDto } from './inputs/Login.dto';
import { ResetPasswordDto } from './inputs/ResetPassword.dto';
import { ChangePasswordDto } from './inputs/ChangePassword.dto';
import { CurrentUser } from 'src/common/decorator/currentUser.decorator';
import { CurrentUserDto } from 'src/common/dtos/currentUser.dto';
import { Permission } from 'src/common/constant/enum.constant';
import { Auth } from 'src/common/decorator/auth.decorator';
import { I18nService } from 'nestjs-i18n';
import { UserResponse } from '../users/dto/UserResponse.dto';
import { AuthServiceFacade } from './fascade/AuthService.facade';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly i18n: I18nService,
    private readonly authService: AuthService,
    private readonly authFacade: AuthServiceFacade,
  ) {}

  @Mutation(() => AuthResponse)
  async register(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<AuthResponse> {
    return this.authFacade.register(createUserDto);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('loginDto') loginDto: LoginDto): Promise<AuthResponse> {
    return this.authFacade.login(loginDto);
  }

  @Mutation(() => AuthResponse)
  @Auth([Permission.FORGOT_PASSWORD])
  async forgotPassword(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<AuthResponse> {
    return this.authService.forgotPassword(user.email);
  }

  @Mutation(() => UserResponse)
  @Auth([Permission.RESET_PASSWORD])
  async resetPassword(
    @Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
  ): Promise<UserResponse> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Mutation(() => UserResponse)
  @Auth([Permission.CHANGE_PASSWORD])
  async changePassword(
    @CurrentUser() user: CurrentUserDto,
    @Args('changePasswordDto') changePasswordDto: ChangePasswordDto,
  ): Promise<UserResponse> {
    return this.authService.changePassword(user?.id, changePasswordDto);
  }

  // @Mutation(() => LogoutResponse)
  // @Auth([Permission.LOGOUT])
  // async logout(@Context('req') req): Promise<LogoutResponse> {
  //   const token = req.headers.authorization?.replace('Bearer ', '');
  //   if (!token) throw new Error(await this.i18n.t('user.NO_TOKEN'));
  //   return {
  //     success: true,
  //     statusCode: 200,
  //     message: 'Logout successful',
  //     timeStamp: new Date().toISOString().split('T')[0],
  //   };
  // }
}
