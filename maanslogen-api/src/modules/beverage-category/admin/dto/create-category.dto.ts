// src/modules/beverage-category/admin/dto/create-category.dto.ts
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateImageDto } from '../../../image/dto/create-image.dto';

export class CreateCategoryDto {
  @ApiProperty({ description: 'The name of the beverage category', example: 'Beer' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The description of the beverage category', example: 'All types of beer' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'List of images (e.g. icon)',
    type: [CreateImageDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImageDto)
  images?: CreateImageDto[];
}
