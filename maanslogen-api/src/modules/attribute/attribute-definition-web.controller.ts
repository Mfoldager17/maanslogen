// src/attribute/attribute-definition-web.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AttributeDefinitionService } from './attribute-definition.service';

@ApiTags('Web – Attribute Definitions')
@Controller('attributes')
export class AttributeDefinitionWebController {
  constructor(private readonly service: AttributeDefinitionService) {}

  @Get()
  @ApiOperation({ summary: '[Web] Get all attribute definitions (public)' })
  @ApiResponse({ status: 200, description: 'List of attribute definitions' })
  findAll() {
    return this.service.findAll();
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: '[Web] Get attribute definitions by category (public)' })
  @ApiParam({ name: 'categoryId', description: 'Beverage category ID' })
  @ApiResponse({ status: 200, description: 'List of attribute definitions' })
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.service.findByCategory(categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: '[Web] Get attribute definition by ID (public)' })
  @ApiParam({ name: 'id', description: 'Attribute definition ID' })
  @ApiResponse({ status: 200, description: 'Attribute definition found' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }
}
