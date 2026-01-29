// user/dto/create-user.dto.ts
import { IsString, IsOptional, IsEmail, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateImageDto } from '../../../common/dto/create-image.dto';

export class CreateUserDto {
  @ApiProperty({ description: 'Unique username for the user', example: 'alice' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Email address of the user', example: 'alice@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Hashed password for the user', example: 'hashedpassword123' })
  @IsString()
  passwordHash: string;

  @ApiProperty({
    description: 'List of images (e.g. profile picture)',
    type: [CreateImageDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImageDto)
  images?: CreateImageDto[];
}
