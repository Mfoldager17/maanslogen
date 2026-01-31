// src/beverage-attribute/beverage-attribute-value-web.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BeverageAttributeValueService } from './beverage-attribute-value.service';

@ApiTags('Web – Beverage Attribute Values')
@Controller('beverage-attributes')
export class BeverageAttributeValueWebController {
  constructor(private readonly service: BeverageAttributeValueService) {}

  @Get('beverage/:beverageId')
  @ApiOperation({ summary: '[Web] Get attribute values for a beverage (public)' })
  @ApiParam({ name: 'beverageId', description: 'Beverage ID' })
  @ApiResponse({ status: 200, description: 'List of attribute values' })
  findAllForBeverage(@Param('beverageId') beverageId: string) {
    return this.service.findAllForBeverage(beverageId);
  }
}
