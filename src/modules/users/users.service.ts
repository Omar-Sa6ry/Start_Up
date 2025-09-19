import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { RedisService } from 'src/common/redis/redis.service';
import { UserResponse, UsersResponse } from './dto/UserResponse.dto';
import { UserProxy } from './proxy/user.proxy';
import { IUserObserver } from './interfaces/IUserObserver.interface';
import { CacheObserver } from './observer/user.observer';
import { User } from './entity/user.entity';
import { Limit, Page } from 'src/common/constant/messages.constant';

@Injectable()
export class UserService {
  private proxy: UserProxy;
  private observers: IUserObserver[] = [];

  constructor(
    private readonly i18n: I18nService,
    private readonly redisService: RedisService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    this.proxy = new UserProxy(this.i18n, this.redisService, this.userRepo);
    this.observers.push(new CacheObserver(this.redisService));
  }

  async findById(id: string): Promise<UserResponse> {
    return this.proxy.findById(id);
  }

  async findByEmail(email: string): Promise<UserResponse> {
    return this.proxy.findByEmail(email);
  }

  async findUsers(
    page: number = Page,
    limit: number = Limit,
  ): Promise<UsersResponse> {
    return this.proxy.findUsers(page, limit);
  }
}
