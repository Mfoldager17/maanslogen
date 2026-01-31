import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Response shape for BeverageType – used by Swagger so the client gets a BeverageType type. */
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
