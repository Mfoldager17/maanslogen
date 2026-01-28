// src/attribute/attribute-definition.module.ts
import { Module } from '@nestjs/common';
import { AttributeDefinitionService } from './attribute-definition.service';
import { AttributeDefinitionController } from './attribute-definition.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [AttributeDefinitionController],
  providers: [AttributeDefinitionService, PrismaService],
  exports: [AttributeDefinitionService],
})
export class AttributeDefinitionModule {}
