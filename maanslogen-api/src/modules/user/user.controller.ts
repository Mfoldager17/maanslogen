import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Retrieve a list of all users' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully' })
  getAll() {
    return this.userService.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user', description: 'Create a new user account' })
  @ApiBody({ type: CreateUserDto, description: 'User data to create' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
