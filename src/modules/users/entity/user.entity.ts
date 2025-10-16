import {
  BaseEntity,
  CapitalTextField,
  EmailField,
  NationalIdField,
  PhoneField,
} from '@bts-soft/core';
import { ObjectType, Field } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Role } from 'src/common/constant/enum.constant';
import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  BeforeUpdate,
  Check,
} from 'typeorm';

@ObjectType()
@Entity('users')
@Check(`("password" IS NOT NULL) OR ("googleId" IS NOT NULL)`)
export class User extends BaseEntity {
  @Field(() => String)
  @Column({ length: 100, nullable: true })
  @CapitalTextField('firstName')
  firstName?: string;

  @Field(() => String)
  @Column({ length: 100, nullable: true })
  @CapitalTextField('lastName')
  lastName?: string;

  @Field(() => String)
  @Column({ length: 201, nullable: true })
  fullName?: string;

  @Field(() => String)
  @Column({ length: 200 })
  @CapitalTextField('Headline')
  headline: string;

  @Field(() => String)
  @Column({ unique: true })
  @PhoneField()
  @Index()
  phone: string;

  @Field(() => String)
  @Column({ unique: true })
  @PhoneField()
  @Index()
  whatsapp: string;

  @Field(() => String)
  @Column({ unique: true })
  @NationalIdField()
  nationalId: string;

  @Field(() => String)
  @Column({ length: 100, unique: true })
  @EmailField()
  @Index()
  email: string;

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @Exclude()
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Field({ nullable: true })
  @Column({ length: 255, nullable: true })
  avatar?: string;

  @Exclude()
  @Column({ nullable: true, unique: true })
  googleId?: string;

  @Exclude()
  @Column({ nullable: true })
  telegramLinkToken?: string;

  @Exclude()
  @Column({ nullable: true })
  telegram_chat_id?: string;

  @Exclude()
  @Column({ nullable: true })
  resetToken?: string;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry?: Date | null;

  @Exclude()
  @Column({ nullable: true })
  fcmToken?: string;

  @BeforeInsert()
  @BeforeUpdate()
  updateFullName() {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
}
