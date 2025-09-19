import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { UserResolver } from './users.resolver';
import { RedisModule } from 'src/common/redis/redis.module';
import { UploadService } from '../../common/upload/upload.service';
import { EmailModule } from 'src/common/queues/email/email.module';
import { UserFacadeService } from './fascade/user.fascade';
import { User } from './entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailModule, RedisModule],
  providers: [UserService, UserResolver, UserFacadeService, UploadService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
