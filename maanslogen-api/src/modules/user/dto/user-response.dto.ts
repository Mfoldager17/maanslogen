import { ApiProperty } from '@nestjs/swagger';

/** Response shape for User – used by Swagger so the client gets a User type. */
export class User {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'Email' })
  email: string;

  @ApiProperty({ description: 'Hashed password (admin only)' })
  passwordHash: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}
