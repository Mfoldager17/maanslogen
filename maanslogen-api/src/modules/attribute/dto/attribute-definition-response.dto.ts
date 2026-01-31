import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Response shape for AttributeDefinition – used by Swagger so the client gets an AttributeDefinition type. */
export class AttributeDefinition {
  @ApiProperty({ description: 'Attribute definition ID' })
  id: string;

  @ApiProperty({ description: 'Category ID' })
  categoryId: string;

  @ApiPropertyOptional({ description: 'Beverage type ID (optional)' })
  typeId?: string | null;

  @ApiProperty({ description: 'Attribute key' })
  attributeKey: string;

  @ApiProperty({ description: 'Display name' })
  displayName: string;

  @ApiProperty({ description: 'Data type', enum: ['string', 'number', 'boolean'] })
  dataType: string;

  @ApiProperty({ description: 'Whether attribute is filterable', default: false })
  filterable: boolean;

  @ApiProperty({ description: 'Whether attribute is required', default: false })
  required: boolean;

  @ApiPropertyOptional({ description: 'Validation rules (JSON)' })
  validationRules?: unknown;

  @ApiPropertyOptional({ description: 'Options (JSON)' })
  options?: unknown;

  @ApiPropertyOptional({ description: 'Sort order' })
  sortOrder?: number | null;
}
