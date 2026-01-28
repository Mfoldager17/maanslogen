import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BeverageCategoryService } from './beverage-category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class BeverageCategoryController {
  constructor(private service: BeverageCategoryService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.service.create(createCategoryDto);
  }
}
