// beverage/dto/create-beverage.dto.ts
import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateBeverageDto {
  @IsString()
  beverageTypeId: string;

  @IsString()
  brand: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsObject()
  metadata?: object;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
