import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Admin response shape for Brand. */
export class Brand {
  @ApiProperty({
    description: 'Brand ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({ description: 'Brand name', example: 'Carlsberg' })
  name: string;

  @ApiPropertyOptional({ description: 'Brand description' })
  description?: string | null;

  @ApiProperty({ description: 'Whether the brand is active', default: true })
  active: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({
    description: 'IDs of categories this brand is allowed in (empty = all)',
    type: [String],
  })
  categoryIds: string[];
}
