import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Response shape for BeverageCategory – used by Swagger so the client gets a BeverageCategory type. */
export class BeverageCategory {
  @ApiProperty({ description: 'Category ID' })
  id: string;

  @ApiProperty({ description: 'Category name' })
  name: string;

  @ApiPropertyOptional({ description: 'Category description' })
  description?: string | null;
}
