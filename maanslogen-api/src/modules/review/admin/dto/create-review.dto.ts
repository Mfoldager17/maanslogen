// src/modules/review/admin/dto/create-review.dto.ts
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'ID of the user creating the review', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'ID of the beverage being reviewed', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  beverageId: string;

  @ApiProperty({ description: 'Rating from 0 to 5', example: 4.5, minimum: 0, maximum: 5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Title of the review', example: 'Great beer!', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Detailed review description', example: 'This beer has a great taste and aroma.', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
