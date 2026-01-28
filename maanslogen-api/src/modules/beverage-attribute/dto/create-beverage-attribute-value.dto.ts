// src/beverage-attribute/dto/create-beverage-attribute-value.dto.ts
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateBeverageAttributeValueDto {
  @IsString()
  beverageId: string;

  @IsString()
  attributeId: string;

  @IsOptional()
  @IsString()
  valueString?: string;

  @IsOptional()
  @IsNumber()
  valueNumber?: number;

  @IsOptional()
  @IsBoolean()
  valueBoolean?: boolean;
}
