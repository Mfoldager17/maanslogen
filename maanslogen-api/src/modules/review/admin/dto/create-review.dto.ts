import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ReviewAnswerItemDto {
  @ApiProperty({
    description: 'Question ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  questionId: string;

  @ApiProperty({ description: 'Answer value', example: '4' })
  @IsString()
  answer: string;
}

export class CreateReviewDto {
  @ApiProperty({
    description: 'ID of the user creating the review',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'ID of the beverage being reviewed',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  beverageId: string;

  @ApiProperty({
    description: 'Rating from 0 to 5',
    example: 4.5,
    minimum: 0,
    maximum: 5,
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    description: 'Title of the review',
    example: 'Great beer!',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Detailed review description',
    example: 'This beer has a great taste and aroma.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Answers to questions',
    type: [ReviewAnswerItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewAnswerItemDto)
  answers?: ReviewAnswerItemDto[];
}
