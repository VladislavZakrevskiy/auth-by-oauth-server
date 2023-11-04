import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GUser } from '@/common/decorators/user.decorator';
import { Authorized } from '@/common/guards/auth.guard';
import { User } from '@prisma/client';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(Authorized)
  findAll(@GUser() user: User) {
    return this.notificationService.findAll(user.id);
  }

  @Delete(':id')
  @UseGuards(Authorized)
  remove(@Param('id') id: string, @GUser() user: User) {
    return this.notificationService.remove(id, user.id);
  }
}
