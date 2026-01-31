import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { BeverageService } from './beverage.service';
import { CreateBeverageDto } from './dto/create-beverage.dto';

@ApiTags('Admin – Beverages')
@Controller('admin/beverages')
export class BeverageAdminController {
  constructor(private beverageService: BeverageService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] Get all beverages' })
  @ApiResponse({ status: 200, description: 'List of beverages' })
  getAll() {
    return this.beverageService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get beverage by ID' })
  @ApiParam({ name: 'id', description: 'Beverage ID' })
  @ApiResponse({ status: 200, description: 'Beverage found' })
  @ApiResponse({ status: 404, description: 'Beverage not found' })
  getById(@Param('id') id: string) {
    return this.beverageService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: '[Admin] Create a new beverage' })
  @ApiBody({ type: CreateBeverageDto })
  @ApiResponse({ status: 201, description: 'Beverage created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createBeverageDto: CreateBeverageDto) {
    return this.beverageService.create(createBeverageDto);
  }
}
