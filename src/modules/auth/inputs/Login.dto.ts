import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { EmailField, PasswordField } from '@bts-soft/core';

@InputType()
export class LoginDto {
  @EmailField()
  email: string;

  @PasswordField()
  password: string;

  @Field()
  @IsString()
  fcmToken: string;
}
