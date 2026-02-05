import { IsString, IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ImageType {
  THUMBNAIL = 'THUMBNAIL',
  LARGE = 'LARGE',
  PROFILE = 'PROFILE',
  ICON = 'ICON',
}

export class CreateImageDto {
  @ApiProperty({ description: 'URL to the image', example: 'https://example.com/image.jpg' })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'Type of image (e.g. thumbnail, large, profile, icon)',
    enum: ImageType,
    example: ImageType.THUMBNAIL,
  })
  @IsEnum(ImageType)
  type: ImageType;

  @ApiPropertyOptional({ description: 'Bredde (px)', minimum: 1, maximum: 4096 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(4096)
  width?: number;

  @ApiPropertyOptional({ description: 'Højde (px)', minimum: 1, maximum: 4096 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(4096)
  height?: number;
}
