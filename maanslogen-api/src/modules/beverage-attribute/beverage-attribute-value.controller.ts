// src/beverage-attribute/beverage-attribute-value.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { BeverageAttributeValueService } from './beverage-attribute-value.service';
import { CreateBeverageAttributeValueDto } from './dto/create-beverage-attribute-value.dto';

@ApiTags('Beverage Attribute Values')
@Controller('beverage-attributes')
export class BeverageAttributeValueController {
  constructor(private readonly service: BeverageAttributeValueService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new beverage attribute value', description: 'Assign an attribute value to a beverage' })
  @ApiBody({ type: CreateBeverageAttributeValueDto, description: 'Beverage attribute value data to create' })
  @ApiResponse({ status: 201, description: 'Beverage attribute value created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() dto: CreateBeverageAttributeValueDto) {
    return this.service.create(dto);
  }

  @Get('beverage/:beverageId')
  @ApiOperation({ summary: 'Get all attribute values for a beverage', description: 'Retrieve all attribute values for a specific beverage' })
  @ApiParam({ name: 'beverageId', description: 'The ID of the beverage', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'List of attribute values retrieved successfully' })
  findAllForBeverage(@Param('beverageId') beverageId: string) {
    return this.service.findAllForBeverage(beverageId);
  }
}
