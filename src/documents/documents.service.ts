import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/services';
import { Document } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async save(document: Document) {
    const savedDocument = this.prisma.document.update({
      where: { id: document.id },
      data: document,
    });

    return savedDocument;
  }

  async deleteDocument(documentId: string) {
    const document = await this.prisma.document.delete({
      where: { id: documentId },
    });

    return document;
  }

  async createDocument(
    document: Omit<Document, 'id' | 'updated_at' | 'created_at'>,
  ) {
    const createdDocument = await this.prisma.document.create({
      data: { ...document },
    });

    return createdDocument;
  }

  async getDocumentById(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    return document;
  }

  async getUserDocuments(userId: string) {
    const documents = await this.prisma.document.findMany({
      where: { contributors: { some: { id: userId } } },
    });

    return documents;
  }
}
