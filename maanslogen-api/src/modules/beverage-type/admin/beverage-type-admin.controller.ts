import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { BeverageTypeService } from '../beverage-type.service';
import { CreateBeverageTypeDto } from './dto/create-beverage-type.dto';
import { UpdateBeverageTypeDto } from './dto/update-beverage-type.dto';
import { BeverageType } from './dto/beverage-type-response.dto';

@ApiTags('Admin – Beverage Types')
@Controller('admin/beverage-types')
export class BeverageTypeAdminController {
  constructor(private service: BeverageTypeService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] Get all beverage types' })
  @ApiResponse({
    status: 200,
    description: 'List of types',
    type: [BeverageType],
  })
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get beverage type by ID' })
  @ApiParam({ name: 'id', description: 'Beverage type ID' })
  @ApiResponse({ status: 200, description: 'Type found', type: BeverageType })
  @ApiResponse({ status: 404, description: 'Not found' })
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  @ApiOperation({ summary: '[Admin] Create a beverage type' })
  @ApiBody({ type: CreateBeverageTypeDto })
  @ApiResponse({ status: 201, description: 'Type created', type: BeverageType })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createBeverageTypeDto: CreateBeverageTypeDto) {
    return this.service.create(createBeverageTypeDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '[Admin] Update beverage type' })
  @ApiParam({ name: 'id', description: 'Beverage type ID' })
  @ApiBody({ type: UpdateBeverageTypeDto })
  @ApiResponse({ status: 200, description: 'Type updated', type: BeverageType })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(@Param('id') id: string, @Body() dto: UpdateBeverageTypeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete beverage type' })
  @ApiParam({ name: 'id', description: 'Beverage type ID' })
  @ApiResponse({
    status: 200,
    description: 'Type deleted',
    schema: { type: 'object', properties: { deleted: { type: 'boolean' } } },
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 409, description: 'Type has beverages' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
