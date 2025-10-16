import { CurrentUserDto, TelegramService } from '@bts-soft/core';
import { Resolver, Mutation, Context } from '@nestjs/graphql';
import { Permission } from 'src/common/constant/enum.constant';
import { Auth } from 'src/common/decorator/auth.decorator';
import { CurrentUser } from 'src/common/decorator/currentUser.decorator';
import { NotificationResponse } from './dto/NotificationResponse.dto';

@Resolver()
export class NotificationsResolver {
  constructor(private readonly telegramService: TelegramService) {}

  @Auth([Permission.GENERATE_TELEGRAM_TOKEN])
  @Mutation(() => NotificationResponse)
  async generateTelegramLinkToken(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<NotificationResponse> {
    const token = await this.telegramService.generateTelegramLinkToken(user);
    return { data: token, statusCode: 201 };
  }
}
