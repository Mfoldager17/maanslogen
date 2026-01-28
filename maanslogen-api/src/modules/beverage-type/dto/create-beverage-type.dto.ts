// beverage-type/dto/create-type.dto.ts
import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBeverageTypeDto {
  @ApiProperty({ description: 'Name of the beverage type', example: 'IPA' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'ID of the beverage category this type belongs to', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  categoryId: string;

  @ApiProperty({ description: 'Description of the beverage type', example: 'Hoppy and bitter', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Whether the beverage type is active', example: true, required: false, default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
