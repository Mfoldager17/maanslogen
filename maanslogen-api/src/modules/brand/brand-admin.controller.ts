import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { Brand } from './dto/brand-response.dto';

@ApiTags('Admin – Brands')
@Controller('admin/brands')
export class BrandAdminController {
  constructor(private service: BrandService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] Get all brands' })
  @ApiResponse({ status: 200, description: 'List of brands', type: [Brand] })
  getAll() {
    return this.service.getAll();
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: '[Admin] Get brands allowed in this category' })
  @ApiParam({ name: 'categoryId', description: 'Beverage category ID' })
  @ApiResponse({ status: 200, description: 'List of brands', type: [Brand] })
  getByCategory(@Param('categoryId') categoryId: string) {
    return this.service.getByCategory(categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get brand by ID' })
  @ApiParam({ name: 'id', description: 'Brand ID' })
  @ApiResponse({ status: 200, description: 'Brand found', type: Brand })
  @ApiResponse({ status: 404, description: 'Not found' })
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  @ApiOperation({ summary: '[Admin] Create a brand' })
  @ApiBody({ type: CreateBrandDto })
  @ApiResponse({ status: 201, description: 'Brand created', type: Brand })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.service.create(createBrandDto);
  }
}
