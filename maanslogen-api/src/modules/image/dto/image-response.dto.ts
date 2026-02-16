import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ImageType } from './create-image.dto';

/** Response shape for Image – used by Swagger so the client gets an Image type. */
export class Image {
  @ApiProperty({ description: 'Image ID' })
  id: string;

  @ApiProperty({
    description:
      'Image URL, or for type ICON the icon itself (e.g. an emoji character like 🍷) – not a link in that case.',
  })
  url: string;

  @ApiProperty({ description: 'Image type', enum: ImageType })
  type: ImageType;

  @ApiPropertyOptional({ description: 'Width in pixels' })
  width?: number | null;

  @ApiPropertyOptional({ description: 'Height in pixels' })
  height?: number | null;
}
