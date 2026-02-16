import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Web response shape for BeverageType. */
export class BeverageType {
  @ApiProperty({ description: 'Beverage type ID' })
  id: string;

  @ApiProperty({ description: 'Category ID' })
  categoryId: string;

  @ApiProperty({ description: 'Type name' })
  name: string;

  @ApiPropertyOptional({ description: 'Type description' })
  description?: string | null;

  @ApiProperty({ description: 'Whether the type is active', default: true })
  active: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}
