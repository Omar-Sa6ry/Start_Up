import { Module, OnModuleInit } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { UserResolver } from './users.resolver';
import { NotificationsResolver } from '../notifications/notifications.resolver';
import { Repository } from 'typeorm';
import { UserResponse } from './dto/UserResponse.dto';
import { NotificationResponse } from '../notifications/dto/NotificationResponse.dto';
import { UserFacadeService } from './fascade/user.fascade';
import { User } from './entity/user.entity';
import {
  RedisModule,
  TelegramModule,
  TelegramService,
  UploadService,
} from '@bts-soft/core';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule, TelegramModule],
  providers: [
    UserService,
    UserResolver,
    UserFacadeService,
    UploadService,
    NotificationsResolver,
  ],
  exports: [UserService, TypeOrmModule],
})
export class UserModule implements OnModuleInit {
  constructor(
    private readonly telegramService: TelegramService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  onModuleInit() {
    // 1. Set the User Repository
    this.telegramService.setUserRepository(this.userRepo);
    this.telegramService.setUserResponseClass(UserResponse);
    this.telegramService.setUserResponseClass(NotificationResponse);

    console.log('TelegramService configured with User Repository.');
  }
}
