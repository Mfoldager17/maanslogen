import {
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ImageType } from '../../image/dto/create-image.dto';

export class PresignSlotDto {
  @ApiProperty({
    description: 'Image type (e.g. thumbnail, large, profile, icon)',
    enum: ImageType,
    example: ImageType.THUMBNAIL,
  })
  @IsEnum(ImageType)
  type: ImageType;

  @ApiPropertyOptional({
    description:
      'Bredde (px) – bruges i key som .../id/widthxheight. Default per type hvis udeladt.',
    minimum: 1,
    maximum: 4096,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4096)
  width?: number;

  @ApiPropertyOptional({
    description:
      'Højde (px) – bruges i key som .../id/widthxheight. Default per type hvis udeladt.',
    minimum: 1,
    maximum: 4096,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4096)
  height?: number;
}

export class PresignUploadDto {
  @ApiProperty({
    description: 'List of image slots – one entry per file you will upload',
    type: [PresignSlotDto],
    example: [{ type: 'THUMBNAIL' }, { type: 'LARGE' }],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one upload slot required' })
  @ArrayMaxSize(10, { message: 'Max 10 images per request' })
  @ValidateNested({ each: true })
  @Type(() => PresignSlotDto)
  uploads: PresignSlotDto[];

  @ApiPropertyOptional({
    description: 'Presigned URL expiry in seconds (default: 900)',
    minimum: 60,
    maximum: 86400,
  })
  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(86400)
  expiresInSeconds?: number;
}
