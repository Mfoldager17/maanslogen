import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BeverageCategoryService } from '../beverage-category.service';
import { BeverageCategory } from './dto/category-response.dto';

@ApiTags('Web – Beverage Categories')
@Controller('beverage-categories')
export class BeverageCategoryWebController {
  constructor(private service: BeverageCategoryService) {}

  @Get()
  @ApiOperation({ summary: '[Web] Get all beverage categories (public)' })
  @ApiResponse({
    status: 200,
    description: 'List of categories',
    type: [BeverageCategory],
  })
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '[Web] Get category by ID (public)' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Category found',
    type: BeverageCategory,
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }
}
