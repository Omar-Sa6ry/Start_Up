import { InputType } from '@nestjs/graphql';
import { PasswordField } from '@bts-soft/core';

@InputType()
export class ChangePasswordDto {
  @PasswordField()
  password: string;

  @PasswordField()
  newPassword: string;
}
