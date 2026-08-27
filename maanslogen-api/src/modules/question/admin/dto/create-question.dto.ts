import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsObject,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @ApiProperty({
    description: 'ID of the beverage category',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  categoryId: string;

  @ApiPropertyOptional({
    description:
      'ID of the beverage type (optional – question applies to all types in category if omitted)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  typeId?: string;

  @ApiProperty({ description: 'Question text', example: 'Hvordan er aromaen?' })
  @IsString()
  questionText: string;

  @ApiProperty({
    description: 'Answer type',
    example: 'text',
    enum: ['text', 'number', 'select', 'rating'],
  })
  @IsString()
  answerType: string;

  @ApiPropertyOptional({
    description: 'Options for select-type (e.g. array of choices)',
    example: ['Lys', 'Mørk'],
  })
  @IsOptional()
  @IsObject()
  options?: object;

  @ApiPropertyOptional({
    description: 'Sort order (lower = first)',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Whether the question is required',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  required?: boolean;
}
