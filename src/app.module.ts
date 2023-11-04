import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import config from './common/configs/config';
import { PrismaService } from './common/services';
import { NotificationModule } from './notification/notification.module';
import { ProvidersService } from './common/services/providers.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { DocumentModule } from './documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: '../.env',
    }),
    UsersModule,
    DocumentModule,
    // NotificationModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, PrismaService, ProvidersService],
})
export class AppModule {}
