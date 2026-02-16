import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Brand } from '../../../brand/web/dto/brand-response.dto';
import { Image } from '../../../image/dto/image-response.dto';

/** Web response shape for Beverage. */
export class Beverage {
  @ApiProperty({ description: 'Beverage ID' })
  id: string;

  @ApiProperty({ description: 'Beverage type ID' })
  beverageTypeId: string;

  @ApiProperty({ description: 'Brand ID' })
  brandId: string;

  @ApiProperty({ description: 'Beverage name' })
  name: string;

  @ApiProperty({ description: 'Country code' })
  country: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: unknown;

  @ApiProperty({ description: 'Average rating', default: 0 })
  averageRating: number;

  @ApiProperty({ description: 'Number of reviews', default: 0 })
  reviewCount: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Brand (when included)', type: Brand })
  brand?: Brand;

  @ApiPropertyOptional({ description: 'Images (when included)', type: [Image] })
  images?: Image[];
}
