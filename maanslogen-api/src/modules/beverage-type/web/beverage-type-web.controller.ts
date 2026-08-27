import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BeverageTypeService } from '../beverage-type.service';
import { BeverageType } from './dto/beverage-type-response.dto';

@ApiTags('Web – Beverage Types')
@Controller('beverage-types')
export class BeverageTypeWebController {
  constructor(private service: BeverageTypeService) {}

  @Get()
  @ApiOperation({ summary: '[Web] Get all beverage types (public)' })
  @ApiResponse({
    status: 200,
    description: 'List of types',
    type: [BeverageType],
  })
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '[Web] Get beverage type by ID (public)' })
  @ApiParam({ name: 'id', description: 'Beverage type ID' })
  @ApiResponse({ status: 200, description: 'Type found', type: BeverageType })
  @ApiResponse({ status: 404, description: 'Not found' })
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }
}
