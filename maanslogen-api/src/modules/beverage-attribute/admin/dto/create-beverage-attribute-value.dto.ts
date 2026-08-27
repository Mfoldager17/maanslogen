// src/modules/beverage-attribute/admin/dto/create-beverage-attribute-value.dto.ts
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBeverageAttributeValueDto {
  @ApiProperty({
    description: 'ID of the beverage',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  beverageId: string;

  @ApiProperty({
    description: 'ID of the attribute definition',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  attributeId: string;

  @ApiProperty({
    description: 'String value (use if attribute dataType is string)',
    example: 'Light and refreshing',
    required: false,
  })
  @IsOptional()
  @IsString()
  valueString?: string;

  @ApiProperty({
    description: 'Number value (use if attribute dataType is number)',
    example: 4.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  valueNumber?: number;

  @ApiProperty({
    description: 'Boolean value (use if attribute dataType is boolean)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  valueBoolean?: boolean;
}
