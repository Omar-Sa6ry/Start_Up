import {
  EmailField,
  PasswordField,
  CapitalTextField,
  PhoneField,
  NationalIdField,
  CreateImageDto,
} from '@bts-soft/core';
import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateUserDto {
  @CapitalTextField('First name')
  firstName: string;

  @CapitalTextField('Last name')
  lastName: string;

  @CapitalTextField('Headline')
  headline: string;

  @EmailField()
  email: string;

  @PasswordField()
  password: string;

  @PhoneField()
  phone: string;

  @PhoneField()
  whatsapp: string;

  @NationalIdField()
  nationalId: string;

  @Field()
  @IsString()
  fcmToken: string;

  @Field(() => CreateImageDto, { nullable: true })
  image: CreateImageDto;
}
