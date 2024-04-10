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

import { CvApiService } from './cv-api.service';
import { CvCreateDto, CvDeleteDto, CvDto, CvUpdateDto } from './dto';

@ApiTags('CVs API')
@Controller('api/cvs')
export class CvApiController {
  constructor(private readonly cvApiService: CvApiService) { }

  @ApiOperation({
    summary: 'Get CV by Id',
  })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.cvApiService.findOne(id);
  }

  @ApiOperation({
    summary: 'Get CVs list',
  })
  @ApiBadRequestResponse({
    description: 'Invalid query params response',
  })
  @Get()
  @UseGuards(
    new ListQueryFilterGuard<CvDto>({
      entityName: CvDto.name,
      filterKeys: [
        'id',
        'applicantId',
        'country',
        'position',
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
    return await this.cvApiService.findMany(params);
  }

  @ApiOperation({
    summary: 'Create CV',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Post()
  async create(@Body() cvCreateDto: CvCreateDto) {
    return await this.cvApiService.create(cvCreateDto);
  }

  @ApiOperation({
    summary: 'Update existing CV',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Patch()
  async update(@Body() cvUpdateDto: CvUpdateDto) {
    return await this.cvApiService.update(cvUpdateDto);
  }

  @ApiOperation({
    summary: 'Delete CV',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Delete()
  async delete(@Body() cvDeleteDto: CvDeleteDto) {
    return await this.cvApiService.delete(cvDeleteDto);
  }
}
