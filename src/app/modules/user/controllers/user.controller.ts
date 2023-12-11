import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateUserDTO } from '../dto/create-user.dto';
import { CreateUserService } from '../services/create-user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post('')
  @ApiResponse({
    status: 200,
    description: 'Users found',
  })
  @ApiResponse({ status: 404, description: 'Users not found' })
  async createUser(@Body() query: CreateUserDTO) {
    return await this.createUserService.execute(query);
  }
}
