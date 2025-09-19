import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CapitalTextField } from 'src/common/decorator/validation/CapitalField.decorator';
import { EmailField } from 'src/common/decorator/validation/EmailField.decorator';
import { NationalIdField } from 'src/common/decorator/validation/nationalId.decorator';
import { PasswordField } from 'src/common/decorator/validation/PasswordField.decorator';
import { PhoneField } from 'src/common/decorator/validation/PhoneField.decorator';
import { CreateImagDto } from 'src/common/upload/dtos/createImage.dto';

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

  @Field(() => CreateImagDto, { nullable: true })
  image: CreateImagDto;
}
