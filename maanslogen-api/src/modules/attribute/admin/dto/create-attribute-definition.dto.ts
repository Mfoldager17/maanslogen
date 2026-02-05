// src/modules/attribute/admin/dto/create-attribute-definition.dto.ts
import { IsString, IsBoolean, IsOptional, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttributeDefinitionDto {
  @ApiProperty({ description: 'IDs of beverage categories this attribute applies to', example: ['123e4567-e89b-12d3-a456-426614174000'], type: [String], minItems: 1 })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  categoryIds: string[];

  @ApiProperty({ description: 'IDs of beverage types (optional; empty = applies to all types in the selected categories)', example: [], type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  typeIds?: string[];

  @ApiProperty({ description: 'Unique key identifier for the attribute', example: 'abv' })
  @IsString()
  attributeKey: string;

  @ApiProperty({ description: 'Display name for the attribute', example: 'Alkohol %' })
  @IsString()
  displayName: string;

  @ApiProperty({ description: 'Data type of the attribute value', example: 'number', enum: ['string', 'number', 'boolean'] })
  @IsString()
  dataType: string;

  @ApiProperty({ description: 'Whether this attribute can be used for filtering', example: true, required: false, default: false })
  @IsBoolean()
  @IsOptional()
  filterable?: boolean;

  @ApiProperty({ description: 'Whether this attribute is required', example: false, required: false, default: false })
  @IsBoolean()
  @IsOptional()
  required?: boolean;
}
