import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BrandService } from '../brand.service';
import { Brand } from './dto/brand-response.dto';

@ApiTags('Web – Brands')
@Controller('brands')
export class BrandWebController {
  constructor(private service: BrandService) {}

  @Get()
  @ApiOperation({ summary: '[Web] Get all brands (public)' })
  @ApiResponse({ status: 200, description: 'List of brands', type: [Brand] })
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '[Web] Get brand by ID (public)' })
  @ApiParam({ name: 'id', description: 'Brand ID' })
  @ApiResponse({ status: 200, description: 'Brand found', type: Brand })
  @ApiResponse({ status: 404, description: 'Not found' })
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }
}
