import { Field, InputType } from '@nestjs/graphql';
import { CreateImagDto } from 'src/common/upload/dtos/createImage.dto';
import { IsOptional } from 'class-validator';
import { CapitalTextField } from 'src/common/decorator/validation/CapitalField.decorator';
import { PhoneField } from 'src/common/decorator/validation/PhoneField.decorator';

@InputType()
export class UpdateUserDto {
  @IsOptional()
  @CapitalTextField('First name', 100, true)
  firstName?: string;

  @IsOptional()
  @CapitalTextField('Last name', 100, true)
  lastName?: string;

  @IsOptional()
  @Field(() => CreateImagDto, { nullable: true })
  avatar?: CreateImagDto;

  @IsOptional()
  @PhoneField(true)
  phone?: string;

  @IsOptional()
  @PhoneField(true)
  whatsapp?: string;
}
