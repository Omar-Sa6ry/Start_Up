import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseResponse, PaginationInfo } from '@bts-soft/core';

@ObjectType()
export class UserResponse extends BaseResponse {
  @Field(() => User, { nullable: true })
  @Expose()
  data: User;
}

@ObjectType()
export class UsersResponse extends BaseResponse {
  @Field(() => [User], { nullable: true })
  items: User[];

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}
