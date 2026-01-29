// beverage/dto/create-beverage.dto.ts
import { IsString, IsOptional, IsObject, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateImageDto } from '../../../common/dto/create-image.dto';

export class CreateBeverageDto {
  @ApiProperty({ description: 'ID of the beverage type', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  beverageTypeId: string;

  @ApiProperty({ description: 'Brand name of the beverage', example: 'Carlsberg' })
  @IsString()
  brand: string;

  @ApiProperty({ description: 'Name of the beverage', example: 'Classic Lager' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Country code where the beverage is from', example: 'DK', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: 'Additional metadata as JSON object', example: { notes: 'Light and refreshing' }, required: false })
  @IsOptional()
  @IsObject()
  metadata?: object;

  @ApiProperty({
    description: 'List of images (e.g. thumbnail, large)',
    type: [CreateImageDto],
    required: false,
  })
  
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImageDto)
  images?: CreateImageDto[];
}
