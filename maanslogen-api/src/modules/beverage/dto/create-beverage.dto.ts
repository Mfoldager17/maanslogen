// beverage/dto/create-beverage.dto.ts
import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ description: 'URL to the beverage image', example: 'https://example.com/beer.jpg', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
