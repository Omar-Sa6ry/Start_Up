import { Module, Scope } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database';
import { AppResolver } from './app.resolver';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/users.module';
import {
  ConfigModule,
  GraphqlModule,
  ThrottlerModule,
  TranslationModule,
} from '@bts-soft/core';

@Module({
  imports: [
    ConfigModule,
    GraphqlModule,
    DatabaseModule,
    ThrottlerModule,
    TranslationModule,

    AuthModule,
    UserModule,
  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}
