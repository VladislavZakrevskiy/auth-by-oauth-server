import {
  Controller,
  Get,
  UseGuards,
  Body,
  Post,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Document } from '@prisma/client';
import { Authorized } from '@/common/guards/auth.guard';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('/user/:id')
  @UseGuards(Authorized)
  getUserDocuments(@Param('id') userId: string) {
    const documents = this.documentsService.getUserDocuments(userId);

    return documents;
  }

  @Get('/:id')
  @UseGuards(Authorized)
  getDocumentById(@Param('id') documentId: string) {
    const document = this.documentsService.getDocumentById(documentId);

    return document;
  }

  @Post('/')
  @UseGuards(Authorized)
  createDocument(@Body() document: Document) {
    const createdDocument = this.documentsService.createDocument(document);

    return createdDocument;
  }

  @Patch('/')
  @UseGuards(Authorized)
  saveDocument(@Body() document: Document) {
    const savedDocument = this.documentsService.save(document);
    return savedDocument;
  }

  @Delete('/:id')
  @UseGuards(Authorized)
  deleteDocument(@Param('id') documentId: string) {
    const document = this.documentsService.deleteDocument(documentId);

    return document;
  }
}
