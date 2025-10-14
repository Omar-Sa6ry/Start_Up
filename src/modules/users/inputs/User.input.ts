import { EmailField, IdField } from '@bts-soft/core';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UserIdInput {
  @IdField('User')
  UserId: string;
}

@InputType()
export class EmailInput {
  @EmailField()
  email: string;
}
