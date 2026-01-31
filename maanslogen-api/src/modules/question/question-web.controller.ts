import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { QuestionService } from './question.service';

@ApiTags('Web – Questions')
@Controller('questions')
export class QuestionWebController {
  constructor(private readonly service: QuestionService) {}

  @Get()
  @ApiOperation({ summary: '[Web] Get all questions (public)' })
  @ApiResponse({ status: 200, description: 'List of questions' })
  findAll() {
    return this.service.findAll();
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: '[Web] Get questions by category (public)' })
  @ApiParam({ name: 'categoryId', description: 'Beverage category ID' })
  @ApiResponse({ status: 200, description: 'List of questions' })
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.service.findByCategory(categoryId);
  }

  @Get('type/:typeId')
  @ApiOperation({ summary: '[Web] Get questions by type (public)' })
  @ApiParam({ name: 'typeId', description: 'Beverage type ID' })
  @ApiResponse({ status: 200, description: 'List of questions' })
  findByType(@Param('typeId') typeId: string) {
    return this.service.findByType(typeId);
  }

  @Get(':id')
  @ApiOperation({ summary: '[Web] Get question by ID (public)' })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question found' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }
}
