// src/modules/beverage-attribute/admin/beverage-attribute-value-admin.controller.ts
import { Controller, Post, Get, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { BeverageAttributeValueService } from '../beverage-attribute-value.service';
import { CreateBeverageAttributeValueDto } from './dto/create-beverage-attribute-value.dto';
import { UpdateBeverageAttributeValueDto } from './dto/update-beverage-attribute-value.dto';
import { BeverageAttributeValue } from './dto/beverage-attribute-value-response.dto';

@ApiTags('Admin – Beverage Attribute Values')
@Controller('admin/beverage-attributes')
export class BeverageAttributeValueAdminController {
  constructor(private readonly service: BeverageAttributeValueService) {}

  @Post()
  @ApiOperation({ summary: '[Admin] Create beverage attribute value' })
  @ApiBody({ type: CreateBeverageAttributeValueDto })
  @ApiResponse({ status: 201, description: 'Attribute value created', type: BeverageAttributeValue })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() dto: CreateBeverageAttributeValueDto) {
    return this.service.create(dto);
  }

  @Get('beverage/:beverageId')
  @ApiOperation({ summary: '[Admin] Get attribute values for a beverage' })
  @ApiParam({ name: 'beverageId', description: 'Beverage ID' })
  @ApiResponse({ status: 200, description: 'List of attribute values', type: [BeverageAttributeValue] })
  findAllForBeverage(@Param('beverageId') beverageId: string) {
    return this.service.findAllForBeverage(beverageId);
  }

  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get attribute value by ID' })
  @ApiParam({ name: 'id', description: 'Attribute value ID' })
  @ApiResponse({ status: 200, description: 'Attribute value found', type: BeverageAttributeValue })
  @ApiResponse({ status: 404, description: 'Not found' })
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '[Admin] Update beverage attribute value' })
  @ApiParam({ name: 'id', description: 'Attribute value ID' })
  @ApiBody({ type: UpdateBeverageAttributeValueDto })
  @ApiResponse({ status: 200, description: 'Attribute value updated', type: BeverageAttributeValue })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(@Param('id') id: string, @Body() dto: UpdateBeverageAttributeValueDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete beverage attribute value' })
  @ApiParam({ name: 'id', description: 'Attribute value ID' })
  @ApiResponse({ status: 200, description: 'Attribute value deleted', schema: { type: 'object', properties: { deleted: { type: 'boolean' } } } })
  @ApiResponse({ status: 404, description: 'Not found' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
