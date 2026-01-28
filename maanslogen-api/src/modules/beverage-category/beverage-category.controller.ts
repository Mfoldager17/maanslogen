import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BeverageCategoryService } from './beverage-category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Beverage Categories')
@Controller('beverage-categories')
export class BeverageCategoryController {
  constructor(private service: BeverageCategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all beverage categories', description: 'Get all beverage categories' })
  @ApiResponse({ status: 200, description: 'List of beverage categories retrieved successfully' })
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a beverage category by ID', description: 'Get a beverage category by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the beverage category', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Beverage category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Beverage category not found' })
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new beverage category', description: 'Create a new beverage category' })
  @ApiBody({ type: CreateCategoryDto, description: 'The beverage category to create' })
  @ApiResponse({ status: 201, description: 'Beverage category created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.service.create(createCategoryDto);
  }
}
