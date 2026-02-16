import { IsString, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrangementBeverageItemDto } from './create-arrangement.dto';

export class UpdateArrangementDto {
  @ApiPropertyOptional({ description: 'Name of the arrangement' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Beverages in order (replaces existing list)',
    type: [ArrangementBeverageItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArrangementBeverageItemDto)
  beverages?: ArrangementBeverageItemDto[];
}
