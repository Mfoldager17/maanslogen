import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({ description: 'Name of the brand', example: 'Carlsberg' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the brand', example: 'Danish brewery', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Whether the brand is active', example: true, required: false, default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
