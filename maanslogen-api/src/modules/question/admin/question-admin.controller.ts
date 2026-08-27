import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { QuestionService } from '../question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './dto/question-response.dto';

@ApiTags('Admin – Questions')
@Controller('admin/questions')
export class QuestionAdminController {
  constructor(private readonly service: QuestionService) {}

  @Post()
  @ApiOperation({ summary: '[Admin] Create a question' })
  @ApiBody({ type: CreateQuestionDto })
  @ApiResponse({ status: 201, description: 'Question created', type: Question })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() dto: CreateQuestionDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '[Admin] Get all questions' })
  @ApiResponse({
    status: 200,
    description: 'List of questions',
    type: [Question],
  })
  findAll() {
    return this.service.findAll();
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: '[Admin] Get questions by category' })
  @ApiParam({ name: 'categoryId', description: 'Beverage category ID' })
  @ApiResponse({
    status: 200,
    description: 'List of questions',
    type: [Question],
  })
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.service.findByCategory(categoryId);
  }

  @Get('type/:typeId')
  @ApiOperation({ summary: '[Admin] Get questions by type' })
  @ApiParam({ name: 'typeId', description: 'Beverage type ID' })
  @ApiResponse({
    status: 200,
    description: 'List of questions',
    type: [Question],
  })
  findByType(@Param('typeId') typeId: string) {
    return this.service.findByType(typeId);
  }

  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get question by ID' })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question found', type: Question })
  @ApiResponse({ status: 404, description: 'Not found' })
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '[Admin] Update question' })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiBody({ type: UpdateQuestionDto })
  @ApiResponse({ status: 200, description: 'Question updated', type: Question })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete question and compact sortOrder' })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({
    status: 200,
    description: 'Question deleted',
    schema: { type: 'object', properties: { deleted: { type: 'boolean' } } },
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
