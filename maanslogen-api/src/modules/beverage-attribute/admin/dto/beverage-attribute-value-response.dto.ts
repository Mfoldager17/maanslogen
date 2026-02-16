import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Admin response shape for BeverageAttributeValue. */
export class BeverageAttributeValue {
  @ApiProperty({ description: 'Attribute value ID' })
  id: string;

  @ApiProperty({ description: 'Beverage ID' })
  beverageId: string;

  @ApiProperty({ description: 'Attribute definition ID' })
  attributeId: string;

  @ApiPropertyOptional({ description: 'String value' })
  valueString?: string | null;

  @ApiPropertyOptional({ description: 'Number value' })
  valueNumber?: number | null;

  @ApiPropertyOptional({ description: 'Boolean value' })
  valueBoolean?: boolean | null;
}
