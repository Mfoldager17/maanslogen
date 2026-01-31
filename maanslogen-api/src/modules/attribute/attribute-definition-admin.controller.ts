// src/attribute/attribute-definition-admin.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { AttributeDefinitionService } from './attribute-definition.service';
import { CreateAttributeDefinitionDto } from './dto/create-attribute-definition.dto';
import { AttributeDefinition } from './dto/attribute-definition-response.dto';

@ApiTags('Admin – Attribute Definitions')
@Controller('admin/attributes')
export class AttributeDefinitionAdminController {
  constructor(private readonly service: AttributeDefinitionService) {}

  @Post()
  @ApiOperation({ summary: '[Admin] Create attribute definition' })
  @ApiBody({ type: CreateAttributeDefinitionDto })
  @ApiResponse({ status: 201, description: 'Attribute definition created', type: AttributeDefinition })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() dto: CreateAttributeDefinitionDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '[Admin] Get all attribute definitions' })
  @ApiResponse({ status: 200, description: 'List of attribute definitions', type: [AttributeDefinition] })
  findAll() {
    return this.service.findAll();
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: '[Admin] Get attribute definitions by category' })
  @ApiParam({ name: 'categoryId', description: 'Beverage category ID' })
  @ApiResponse({ status: 200, description: 'List of attribute definitions', type: [AttributeDefinition] })
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.service.findByCategory(categoryId);
  }

  @Get('type/:beverageTypeId')
  @ApiOperation({ summary: '[Admin] Get attribute definitions that apply to a beverage type' })
  @ApiParam({ name: 'beverageTypeId', description: 'Beverage type ID' })
  @ApiResponse({ status: 200, description: 'List of attribute definitions', type: [AttributeDefinition] })
  findByType(@Param('beverageTypeId') beverageTypeId: string) {
    return this.service.findByType(beverageTypeId);
  }

  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get attribute definition by ID' })
  @ApiParam({ name: 'id', description: 'Attribute definition ID' })
  @ApiResponse({ status: 200, description: 'Attribute definition found', type: AttributeDefinition })
  @ApiResponse({ status: 404, description: 'Not found' })
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }
}
