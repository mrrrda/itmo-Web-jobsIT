import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserApiService } from './user-api.service';
import { UserCreateDto, UserDeleteDto, UserUpdateDto } from './dto';

@ApiTags('Users API')
@Controller('api/users')
export class UserApiController {
  constructor(private readonly userApiService: UserApiService) { }

  @ApiOperation({
    summary: 'Get user by Id',
  })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userApiService.findOne(id);
  }

  @ApiOperation({
    summary: 'Create new user',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Post()
  async create(@Body() userCreateDto: UserCreateDto) {
    return await this.userApiService.create(userCreateDto);
  }

  @ApiOperation({
    summary: 'Update user information',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Patch()
  async update(@Body() userUpdateDto: UserUpdateDto) {
    return await this.userApiService.update(userUpdateDto);
  }

  @ApiOperation({
    summary: 'Delete user',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Delete()
  async delete(@Body() userDeleteDto: UserDeleteDto) {
    return await this.userApiService.delete(userDeleteDto);
  }
}
