// src/attribute/attribute-definition.module.ts
import { Module } from '@nestjs/common';
import { AttributeDefinitionService } from './attribute-definition.service';
import { AttributeDefinitionAdminController } from './attribute-definition-admin.controller';
import { AttributeDefinitionWebController } from './attribute-definition-web.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [AttributeDefinitionAdminController, AttributeDefinitionWebController],
  providers: [AttributeDefinitionService, PrismaService],
  exports: [AttributeDefinitionService],
})
export class AttributeDefinitionModule {}
