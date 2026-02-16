import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ArrangementService } from '../arrangement.service';
import { Arrangement } from './dto/arrangement-response.dto';

@ApiTags('Web – Arrangements')
@Controller('arrangements')
export class ArrangementWebController {
  constructor(private arrangementService: ArrangementService) {}

  @Get()
  @ApiOperation({ summary: '[Web] Get all arrangements (public)' })
  @ApiResponse({ status: 200, description: 'List of arrangements', type: [Arrangement] })
  getAll() {
    return this.arrangementService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '[Web] Get arrangement by ID (public)' })
  @ApiParam({ name: 'id', description: 'Arrangement ID' })
  @ApiResponse({ status: 200, description: 'Arrangement found', type: Arrangement })
  @ApiResponse({ status: 404, description: 'Not found' })
  getById(@Param('id') id: string) {
    return this.arrangementService.getById(id);
  }
}
