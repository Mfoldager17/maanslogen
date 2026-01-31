import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ReviewService } from './review.service';

@ApiTags('Web – Reviews')
@Controller('reviews')
export class ReviewWebController {
  constructor(private reviewService: ReviewService) {}

  @Get()
  @ApiOperation({ summary: '[Web] Get all reviews (public)' })
  @ApiResponse({ status: 200, description: 'List of reviews' })
  getAll() {
    return this.reviewService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '[Web] Get review by ID (public)' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review found' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getById(@Param('id') id: string) {
    return this.reviewService.getById(id);
  }
}
