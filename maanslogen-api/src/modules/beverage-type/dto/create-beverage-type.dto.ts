// beverage-type/dto/create-type.dto.ts
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateBeverageTypeDto {
  @IsString()
  name: string;

  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
