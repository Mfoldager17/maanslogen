import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BeverageService } from './beverage.service';

@ApiTags('Web – Beverages')
@Controller('beverages')
export class BeverageWebController {
  constructor(private beverageService: BeverageService) {}

  @Get()
  @ApiOperation({ summary: '[Web] Get all beverages (public)' })
  @ApiResponse({ status: 200, description: 'List of beverages' })
  getAll() {
    return this.beverageService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '[Web] Get beverage by ID (public)' })
  @ApiParam({ name: 'id', description: 'Beverage ID' })
  @ApiResponse({ status: 200, description: 'Beverage found' })
  @ApiResponse({ status: 404, description: 'Beverage not found' })
  getById(@Param('id') id: string) {
    return this.beverageService.getById(id);
  }
}
