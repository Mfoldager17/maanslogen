import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Web response shape for AttributeDefinition. */
export class AttributeDefinition {
  @ApiProperty({ description: 'Attribute definition ID' })
  id: string;

  @ApiProperty({
    description: 'Category IDs this attribute applies to',
    type: [String],
  })
  categoryIds: string[];

  @ApiPropertyOptional({
    description: 'Type IDs (optional; empty = all types in the categories)',
    type: [String],
  })
  typeIds?: string[];

  @ApiProperty({ description: 'Attribute key' })
  attributeKey: string;

  @ApiProperty({ description: 'Display name' })
  displayName: string;

  @ApiProperty({
    description: 'Data type',
    enum: ['string', 'number', 'boolean'],
  })
  dataType: string;

  @ApiProperty({
    description: 'Whether attribute is filterable',
    default: false,
  })
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
