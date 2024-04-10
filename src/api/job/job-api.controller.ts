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

import { JobApiService } from './job-api.service';
import { JobCreateDto, JobUpdateDto, JobDeleteDto, JobDto } from './dto';

@ApiTags('Jobs API')
@Controller('api/jobs')
export class JobApiController {
  constructor(private readonly jobApiService: JobApiService) { }

  @ApiOperation({
    summary: 'Get job item by Id',
  })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.jobApiService.findOne(id);
  }

  @ApiOperation({
    summary: 'Get jobs list',
  })
  @ApiBadRequestResponse({
    description: 'Invalid query params response',
  })
  @Get()
  @UseGuards(
    new ListQueryFilterGuard<JobDto>({
      entityName: JobDto.name,
      filterKeys: [
        'id',
        'locationId',
        'location',
        'title',
        'education',
        'experience',
        'minSalary',
        'maxSalary',
        'workPlace',
        'workSchedule',
      ],
    }),
  )
  async findMany(@Query() params: FindManyQueryParams) {
    return await this.jobApiService.findMany(params);
  }

  @ApiOperation({
    summary: 'Create new job item',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Post()
  async create(@Body() jobCreateDto: JobCreateDto) {
    return await this.jobApiService.create(jobCreateDto);
  }

  @ApiOperation({
    summary: 'Update existing job item',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Patch()
  async update(@Body() jobUpdateDto: JobUpdateDto) {
    return await this.jobApiService.update(jobUpdateDto);
  }

  @ApiOperation({
    summary: 'Delete job item',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Delete()
  async delete(@Body() jobDeleteDto: JobDeleteDto) {
    return await this.jobApiService.delete(jobDeleteDto);
  }
}
