// src/beverage-attribute/beverage-attribute-value-admin.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { BeverageAttributeValueService } from './beverage-attribute-value.service';
import { CreateBeverageAttributeValueDto } from './dto/create-beverage-attribute-value.dto';
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
}
