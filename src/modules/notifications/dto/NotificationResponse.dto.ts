import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { BaseResponse } from '@bts-soft/core';

@ObjectType()
export class NotificationResponse extends BaseResponse {
  @Field(() => String)
  @Expose()
  data: string;
}
