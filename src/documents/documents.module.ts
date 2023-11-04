import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/services';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DocumentGateway } from './document.gateway';
import { ProvidersService } from '@/common/services/providers.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({})],
  providers: [
    DocumentsService,
    PrismaService,
    DocumentGateway,
    ProvidersService,
  ],
  controllers: [DocumentsController],
})
export class DocumentModule {}
