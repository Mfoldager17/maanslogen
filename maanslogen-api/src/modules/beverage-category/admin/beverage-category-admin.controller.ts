import { Body, Controller, Get, Param, Post, Patch, Delete } from '@nestjs/common';
import { BeverageCategoryService } from '../beverage-category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
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

  @Patch(':id')
  @ApiOperation({ summary: '[Admin] Update beverage category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Category updated', type: BeverageCategory })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete beverage category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category deleted', schema: { type: 'object', properties: { deleted: { type: 'boolean' } } } })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 409, description: 'Category has types or brands' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
