// src/modules/beverage-category/admin/dto/create-category.dto.ts
import { IsString, IsOptional, IsArray, ValidateNested, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateImageDto } from '../../../image/dto/create-image.dto';

/** Én emoji (inkl. modifier som hudtone, ZWJ-sekvenser). */
const EMOJI_ONLY_REGEX = /^\p{Extended_Pictographic}(\p{Emoji_Modifier}|\u{200D}\p{Extended_Pictographic})*$/u;

export class CreateCategoryDto {
  @ApiProperty({ description: 'The name of the beverage category', example: 'Beer' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Icon – kun én emoji', example: '🍺' })
  @IsOptional()
  @IsString()
  @Matches(EMOJI_ONLY_REGEX, { message: 'Icon skal være præcis én emoji' })
  icon?: string;

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
