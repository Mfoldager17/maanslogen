// src/beverage-attribute/beverage-attribute-value.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { BeverageAttributeValueService } from './beverage-attribute-value.service';
import { CreateBeverageAttributeValueDto } from './dto/create-beverage-attribute-value.dto';

@Controller('beverage-attributes')
export class BeverageAttributeValueController {
  constructor(private readonly service: BeverageAttributeValueService) {}

  @Post()
  create(@Body() dto: CreateBeverageAttributeValueDto) {
    return this.service.create(dto);
  }

  @Get('beverage/:beverageId')
  findAllForBeverage(@Param('beverageId') beverageId: string) {
    return this.service.findAllForBeverage(beverageId);
  }
}
