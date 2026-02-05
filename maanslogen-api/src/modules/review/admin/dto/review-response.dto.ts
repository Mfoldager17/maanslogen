import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Admin response shape for Review. */
export class Review {
  @ApiProperty({ description: 'Review ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Beverage ID' })
  beverageId: string;

  @ApiProperty({ description: 'Rating (0–5)' })
  rating: number;

  @ApiPropertyOptional({ description: 'Review title' })
  title?: string | null;

  @ApiPropertyOptional({ description: 'Review description' })
  description?: string | null;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
