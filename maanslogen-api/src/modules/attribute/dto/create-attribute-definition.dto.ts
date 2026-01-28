// src/attribute/dto/create-attribute-definition.dto.ts
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateAttributeDefinitionDto {
  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  typeId?: string;

  @IsString()
  attributeKey: string;

  @IsString()
  displayName: string;

  @IsString()
  dataType: string;

  @IsBoolean()
  @IsOptional()
  filterable?: boolean;

  @IsBoolean()
  @IsOptional()
  required?: boolean;
}
