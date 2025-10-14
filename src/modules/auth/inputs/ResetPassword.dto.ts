import { Field, InputType } from '@nestjs/graphql';
import { PasswordField } from '@bts-soft/core';

@InputType()
export class ResetPasswordDto {
  @Field()
  token: string;

  @PasswordField()
  password: string;
}
