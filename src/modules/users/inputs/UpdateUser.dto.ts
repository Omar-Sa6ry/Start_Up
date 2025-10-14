import { CapitalTextField, CreateImageDto, PhoneField } from '@bts-soft/core';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateUserDto {
  @IsOptional()
  @CapitalTextField('First name', 5, 100, true)
  firstName?: string;

  @IsOptional()
  @CapitalTextField('Last name', 5, 100, true)
  lastName?: string;

  @IsOptional()
  @Field(() => CreateImageDto, { nullable: true })
  avatar?: CreateImageDto;

  @IsOptional()
  @PhoneField('EG', true)
  phone?: string;

  @IsOptional()
  @PhoneField('EG', true)
  whatsapp?: string;
}
