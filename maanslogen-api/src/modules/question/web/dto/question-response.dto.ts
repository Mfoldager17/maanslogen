import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Web response shape for Question. */
export class Question {
  @ApiProperty({ description: 'Question ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Beverage category ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  categoryId: string;

  @ApiPropertyOptional({ description: 'Beverage type ID (optional)', example: '123e4567-e89b-12d3-a456-426614174000' })
  typeId?: string | null;

  @ApiProperty({ description: 'Question text', example: 'Hvordan er aromaen?' })
  questionText: string;

  @ApiProperty({ description: 'Answer type', example: 'text', enum: ['text', 'number', 'select', 'rating'] })
  answerType: string;

  @ApiPropertyOptional({ description: 'Options for select-type (e.g. array of choices)' })
  options?: unknown;

  @ApiPropertyOptional({ description: 'Sort order (lower = first)' })
  sortOrder?: number | null;

  @ApiProperty({ description: 'Whether the question is required', default: false })
  required: boolean;
}
