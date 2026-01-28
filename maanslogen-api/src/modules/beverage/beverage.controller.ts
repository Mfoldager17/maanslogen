import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { BeverageService } from './beverage.service';
import { CreateBeverageDto } from './dto/create-beverage.dto';

@ApiTags('Beverages')
@Controller('beverages')
export class BeverageController {
  constructor(private beverageService: BeverageService) {}

  @Get()
  @ApiOperation({ summary: 'Get all beverages', description: 'Retrieve a list of all beverages' })
  @ApiResponse({ status: 200, description: 'List of beverages retrieved successfully' })
  getAll() {
    return this.beverageService.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new beverage', description: 'Create a new beverage entry' })
  @ApiBody({ type: CreateBeverageDto, description: 'Beverage data to create' })
  @ApiResponse({ status: 201, description: 'Beverage created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createBeverageDto: CreateBeverageDto) {
    return this.beverageService.create(createBeverageDto);
  }
}
