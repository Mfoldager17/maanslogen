// src/attribute/attribute-definition.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { AttributeDefinitionService } from './attribute-definition.service';
import { CreateAttributeDefinitionDto } from './dto/create-attribute-definition.dto';

@ApiTags('Attribute Definitions')
@Controller('attributes')
export class AttributeDefinitionController {
  constructor(private readonly service: AttributeDefinitionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new attribute definition', description: 'Create a new attribute definition for beverages' })
  @ApiBody({ type: CreateAttributeDefinitionDto, description: 'Attribute definition data to create' })
  @ApiResponse({ status: 201, description: 'Attribute definition created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() dto: CreateAttributeDefinitionDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attribute definitions', description: 'Retrieve a list of all attribute definitions' })
  @ApiResponse({ status: 200, description: 'List of attribute definitions retrieved successfully' })
  findAll() {
    return this.service.findAll();
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get attribute definitions by category', description: 'Retrieve all attribute definitions for a specific category' })
  @ApiParam({ name: 'categoryId', description: 'The ID of the beverage category', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'List of attribute definitions retrieved successfully' })
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.service.findByCategory(categoryId);
  }
}
