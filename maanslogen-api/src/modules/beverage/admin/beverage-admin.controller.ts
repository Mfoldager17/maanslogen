import { Body, Controller, Get, Param, Post, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { BeverageService } from '../beverage.service';
import { CreateBeverageDto } from './dto/create-beverage.dto';
import { UpdateBeverageDto } from './dto/update-beverage.dto';
import { Beverage } from './dto/beverage-response.dto';

@ApiTags('Admin – Beverages')
@Controller('admin/beverages')
export class BeverageAdminController {
  constructor(private beverageService: BeverageService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] Get all beverages' })
  @ApiResponse({ status: 200, description: 'List of beverages', type: [Beverage] })
  getAll() {
    return this.beverageService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get beverage by ID' })
  @ApiParam({ name: 'id', description: 'Beverage ID' })
  @ApiResponse({ status: 200, description: 'Beverage found', type: Beverage })
  @ApiResponse({ status: 404, description: 'Beverage not found' })
  getById(@Param('id') id: string) {
    return this.beverageService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: '[Admin] Create a new beverage' })
  @ApiBody({ type: CreateBeverageDto })
  @ApiResponse({ status: 201, description: 'Beverage created', type: Beverage })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createBeverageDto: CreateBeverageDto) {
    return this.beverageService.create(createBeverageDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '[Admin] Update beverage' })
  @ApiParam({ name: 'id', description: 'Beverage ID' })
  @ApiBody({ type: UpdateBeverageDto })
  @ApiResponse({ status: 200, description: 'Beverage updated', type: Beverage })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(@Param('id') id: string, @Body() dto: UpdateBeverageDto) {
    return this.beverageService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete beverage' })
  @ApiParam({ name: 'id', description: 'Beverage ID' })
  @ApiResponse({ status: 200, description: 'Beverage deleted', schema: { type: 'object', properties: { deleted: { type: 'boolean' } } } })
  @ApiResponse({ status: 404, description: 'Not found' })
  remove(@Param('id') id: string) {
    return this.beverageService.remove(id);
  }
}
