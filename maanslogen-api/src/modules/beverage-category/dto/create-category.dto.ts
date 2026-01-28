// beverage-category/dto/create-category.dto.ts
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'The name of the beverage category', example: 'Beer' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The description of the beverage category', example: 'All types of beer' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'The icon of the beverage category', example: '🍺' })
  @IsOptional()
  @IsString()
  icon?: string;
}
