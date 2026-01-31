import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './dto/review-response.dto';

@ApiTags('Admin – Reviews')
@Controller('admin/reviews')
export class ReviewAdminController {
  constructor(private reviewService: ReviewService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] Get all reviews' })
  @ApiResponse({ status: 200, description: 'List of reviews', type: [Review] })
  getAll() {
    return this.reviewService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review found', type: Review })
  @ApiResponse({ status: 404, description: 'Not found' })
  getById(@Param('id') id: string) {
    return this.reviewService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: '[Admin] Create a review' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 201, description: 'Review created', type: Review })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }
}
