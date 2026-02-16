import { IsString, IsOptional, IsArray, IsIn, ValidateNested, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ArrangementBeverageItemDto {
  @ApiProperty({ description: 'Beverage ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  beverageId: string;

  @ApiProperty({ description: 'Order in the list (0, 1, 2, …)', example: 0, minimum: 0 })
  @Min(0)
  sortOrder: number;
}

export class CreateArrangementDto {
  @ApiProperty({ description: 'Arrangement type', enum: ['TASTING'] })
  @IsIn(['TASTING'])
  type: 'TASTING';

  @ApiProperty({ description: 'Name of the arrangement', example: 'IPA-smagning' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Optional description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'ID of the user creating the arrangement', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  createdById: string;

  @ApiProperty({
    description: 'Beverages in order (sortOrder determines display order)',
    type: [ArrangementBeverageItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArrangementBeverageItemDto)
  beverages: ArrangementBeverageItemDto[];
}
