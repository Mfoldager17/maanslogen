import { Body, Controller, Get, Param, Post, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ArrangementService } from '../arrangement.service';
import { CreateArrangementDto } from './dto/create-arrangement.dto';
import { UpdateArrangementDto } from './dto/update-arrangement.dto';
import { Arrangement } from '../web/dto/arrangement-response.dto';

@ApiTags('Admin – Arrangements')
@Controller('admin/arrangements')
export class ArrangementAdminController {
  constructor(private arrangementService: ArrangementService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] Get all arrangements' })
  @ApiResponse({ status: 200, description: 'List of arrangements', type: [Arrangement] })
  getAll() {
    return this.arrangementService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get arrangement by ID' })
  @ApiParam({ name: 'id', description: 'Arrangement ID' })
  @ApiResponse({ status: 200, description: 'Arrangement found', type: Arrangement })
  @ApiResponse({ status: 404, description: 'Not found' })
  getById(@Param('id') id: string) {
    return this.arrangementService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: '[Admin] Create arrangement (e.g. tasting)' })
  @ApiBody({ type: CreateArrangementDto })
  @ApiResponse({ status: 201, description: 'Arrangement created', type: Arrangement })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() dto: CreateArrangementDto) {
    return this.arrangementService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '[Admin] Update arrangement' })
  @ApiParam({ name: 'id', description: 'Arrangement ID' })
  @ApiBody({ type: UpdateArrangementDto })
  @ApiResponse({ status: 200, description: 'Arrangement updated', type: Arrangement })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(@Param('id') id: string, @Body() dto: UpdateArrangementDto) {
    return this.arrangementService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete arrangement' })
  @ApiParam({ name: 'id', description: 'Arrangement ID' })
  @ApiResponse({ status: 200, description: 'Arrangement deleted', schema: { type: 'object', properties: { deleted: { type: 'boolean' } } } })
  @ApiResponse({ status: 404, description: 'Not found' })
  remove(@Param('id') id: string) {
    return this.arrangementService.remove(id);
  }
}
