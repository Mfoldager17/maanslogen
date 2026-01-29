import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}
