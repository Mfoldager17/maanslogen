import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { BeverageTypeService } from './beverage-type.service';
import { CreateBeverageTypeDto } from './dto/create-beverage-type.dto';

@ApiTags('Beverage Types')
@Controller('beverage-types')
export class BeverageTypeController {
  constructor(private service: BeverageTypeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all beverage types', description: 'Retrieve a list of all beverage types' })
  @ApiResponse({ status: 200, description: 'List of beverage types retrieved successfully' })
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a beverage type by ID', description: 'Retrieve a specific beverage type by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the beverage type', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Beverage type retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Beverage type not found' })
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new beverage type', description: 'Create a new beverage type' })
  @ApiBody({ type: CreateBeverageTypeDto, description: 'Beverage type data to create' })
  @ApiResponse({ status: 201, description: 'Beverage type created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createBeverageTypeDto: CreateBeverageTypeDto) {
    return this.service.create(createBeverageTypeDto);
  }
}
