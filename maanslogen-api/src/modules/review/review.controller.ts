import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reviews', description: 'Retrieve a list of all reviews' })
  @ApiResponse({ status: 200, description: 'List of reviews retrieved successfully' })
  getAll() {
    return this.reviewService.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new review', description: 'Create a new review for a beverage' })
  @ApiBody({ type: CreateReviewDto, description: 'Review data to create' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  } 
}
