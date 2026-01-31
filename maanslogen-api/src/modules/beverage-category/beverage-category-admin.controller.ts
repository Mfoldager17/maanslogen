import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BeverageCategoryService } from './beverage-category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { BeverageCategory } from './dto/category-response.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin – Beverage Categories')
@Controller('admin/beverage-categories')
export class BeverageCategoryAdminController {
  constructor(private service: BeverageCategoryService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] Get all beverage categories' })
  @ApiResponse({ status: 200, description: 'List of categories', type: [BeverageCategory] })
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category found', type: BeverageCategory })
  @ApiResponse({ status: 404, description: 'Not found' })
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  @ApiOperation({ summary: '[Admin] Create a beverage category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Category created', type: BeverageCategory })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.service.create(createCategoryDto);
  }
}
