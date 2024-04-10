import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApplicantApiService } from './applicant-api.service';
import { ApplicantCreateDto, ApplicantDeleteDto, ApplicantUpdateDto } from './dto';

@ApiTags('Applicants API')
@Controller('api/applicants')
export class ApplicantApiController {
  constructor(private readonly applicantApiService: ApplicantApiService) { }

  @ApiOperation({
    summary: 'Get applicant by Id',
  })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.applicantApiService.findOne(id);
  }

  @ApiOperation({
    summary: 'Create new applicant',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Post()
  async create(@Body() applicantCreateDto: ApplicantCreateDto) {
    return await this.applicantApiService.create(applicantCreateDto);
  }

  @ApiOperation({
    summary: 'Update applicant information',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Patch()
  async update(@Body() applicantUpdateDto: ApplicantUpdateDto) {
    return await this.applicantApiService.update(applicantUpdateDto);
  }

  @ApiOperation({
    summary: 'Delete applicant',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Delete()
  async delete(@Body() applicantDeleteDto: ApplicantDeleteDto) {
    return await this.applicantApiService.delete(applicantDeleteDto);
  }
}
