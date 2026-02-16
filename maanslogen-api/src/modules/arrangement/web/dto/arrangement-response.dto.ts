import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Beverage } from '../../../beverage/web/dto/beverage-response.dto';

/** Single beverage entry in an arrangement (with sort order). */
export class ArrangementBeverageItem {
  @ApiProperty({ description: 'Join record ID' })
  id: string;

  @ApiProperty({ description: 'Order in the list (0, 1, 2, …)' })
  sortOrder: number;

  @ApiProperty({ description: 'Beverage', type: Beverage })
  beverage: Beverage;
}

/** Arrangement response (e.g. tasting) with beverages in order. */
export class Arrangement {
  @ApiProperty({ description: 'Arrangement ID' })
  id: string;

  @ApiProperty({ description: 'Arrangement type', enum: ['TASTING'] })
  type: string;

  @ApiProperty({ description: 'Name' })
  name: string;

  @ApiPropertyOptional({ description: 'Description' })
  description?: string | null;

  @ApiProperty({ description: 'Creator user ID' })
  createdById: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Beverages in order (when included)', type: [ArrangementBeverageItem] })
  beverages?: ArrangementBeverageItem[];
}
