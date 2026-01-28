// src/attribute/dto/create-attribute-definition.dto.ts
import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttributeDefinitionDto {
  @ApiProperty({ description: 'ID of the beverage category', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  categoryId: string;

  @ApiProperty({ description: 'ID of the beverage type (optional, null for category-wide attributes)', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsOptional()
  @IsString()
  typeId?: string;

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
