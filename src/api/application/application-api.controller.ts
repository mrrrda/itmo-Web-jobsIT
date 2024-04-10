import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindManyQueryParams } from 'src/common/dto';
import { ListQueryFilterGuard } from 'src/common/guards';

import { ApplicationApiService } from './application-api.service';
import {
  ApplicationCreateDto,
  ApplicationUpdateDto,
  ApplicationDeleteDto,
  ApplicationDto,
} from './dto';

@ApiTags('Job Applications API')
@Controller('api/applications')
export class ApplicationApiController {
  constructor(private readonly applicationApiService: ApplicationApiService) { }

  @ApiOperation({
    summary: 'Get application by Id',
  })
  @Get(':id')
  @ApiNotFoundResponse({ description: 'Not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.applicationApiService.findOne(id);
  }

  @ApiOperation({
    summary: 'Get applications list',
  })
  @ApiBadRequestResponse({
    description: 'Invalid query params response',
  })
  @Get()
  @UseGuards(
    new ListQueryFilterGuard<ApplicationDto>({
      entityName: ApplicationDto.name,
      filterKeys: ['id', 'jobItemId', 'cvId', 'status'],
    }),
  )
  async findMany(@Query() params: FindManyQueryParams) {
    return await this.applicationApiService.findMany(params);
  }

  @ApiOperation({
    summary: 'Create new application',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Post()
  async create(@Body() applicationCreateDto: ApplicationCreateDto) {
    return await this.applicationApiService.create(applicationCreateDto);
  }

  @ApiOperation({
    summary: 'Update existing application',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Patch()
  async update(@Body() applicationUpdateDto: ApplicationUpdateDto) {
    return await this.applicationApiService.update(applicationUpdateDto);
  }

  @ApiOperation({
    summary: 'Delete application',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Delete()
  async delete(@Body() applicationDeleteDto: ApplicationDeleteDto) {
    return await this.applicationApiService.delete(applicationDeleteDto);
  }
}
