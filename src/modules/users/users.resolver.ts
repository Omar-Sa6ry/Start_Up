import { UserService } from 'src/modules/users/users.service';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateUserDto } from './inputs/UpdateUser.dto';
import { Permission } from 'src/common/constant/enum.constant';
import { CurrentUserDto } from 'src/common/dtos/currentUser.dto';
import { CurrentUser } from 'src/common/decorator/currentUser.decorator';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserResponse, UsersResponse } from './dto/UserResponse.dto';
import { EmailInput, UserIdInput } from './inputs/user.input';
import { UserFacadeService } from './fascade/user.fascade';
import { User } from './entity/user.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userFacade: UserFacadeService,
    private readonly userService: UserService,
  ) {}

  @Query((returns) => UserResponse)
  @Auth([Permission.VIEW_USER])
  async getUserById(@Args('id') id: UserIdInput): Promise<UserResponse> {
    return await this.userService.findById(id.UserId);
  }

  @Query((returns) => UserResponse)
  @Auth([Permission.VIEW_USER])
  async getUserByEmail(
    @Args('email') email: EmailInput,
  ): Promise<UserResponse> {
    return await this.userService.findByEmail(email.email);
  }

  @Query((returns) => UsersResponse)
  @Auth([Permission.VIEW_USER])
  async getUsers(
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<UsersResponse> {
    return await this.userService.findUsers(page, limit);
  }

  @Mutation((returns) => UserResponse)
  @Auth([Permission.UPDATE_USER])
  async updateUser(
    @CurrentUser() user: CurrentUserDto,
    @Args('updateUserDto') updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return this.userFacade.update(updateUserDto, user.id);
  }

  @Query((returns) => UserResponse)
  @Auth([Permission.DELETE_USER])
  async deleteUser(@Args('id') id: UserIdInput): Promise<UserResponse> {
    return await this.userFacade.deleteUser(id.UserId);
  }

  @Mutation((returns) => UserResponse)
  @Auth([Permission.EDIT_USER_ROLE])
  async UpdateUserRoleToAdmin(
    @Args('id') id: UserIdInput,
  ): Promise<UserResponse> {
    return await this.userFacade.editUserRole(id.UserId);
  }
}
