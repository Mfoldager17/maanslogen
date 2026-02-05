import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Image } from '../../../image/dto/image-response.dto';

/** Admin response shape for BeverageCategory. */
export class BeverageCategory {
  @ApiProperty({ description: 'Category ID' })
  id: string;

  @ApiProperty({ description: 'Category name' })
  name: string;

  @ApiPropertyOptional({ description: 'Category description' })
  description?: string | null;

  @ApiPropertyOptional({ description: 'Category images (e.g. icon)', type: [Image] })
  images?: Image[];
}
