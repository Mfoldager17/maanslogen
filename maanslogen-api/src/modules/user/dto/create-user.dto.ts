// user/dto/create-user.dto.ts
import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ description: 'URL to the user profile picture', example: 'https://example.com/avatar.jpg', required: false })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}
