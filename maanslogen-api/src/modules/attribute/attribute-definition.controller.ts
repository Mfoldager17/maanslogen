// src/attribute/attribute-definition.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AttributeDefinitionService } from './attribute-definition.service';
import { CreateAttributeDefinitionDto } from './dto/create-attribute-definition.dto';

@Controller('attributes')
export class AttributeDefinitionController {
  constructor(private readonly service: AttributeDefinitionService) {}

  @Post()
  create(@Body() dto: CreateAttributeDefinitionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.service.findByCategory(categoryId);
  }
}
