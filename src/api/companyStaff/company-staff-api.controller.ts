import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CompanyStaffApiService } from './company-staff-api.service';
import { CompanyStaffCreateDto, CompanyStaffDeleteDto, CompanyStaffUpdateDto } from './dto';

@ApiTags('CompanyStaffs API')
@Controller('api/companyStaffs')
export class CompanyStaffApiController {
  constructor(private readonly companyStaffApiService: CompanyStaffApiService) { }

  @ApiOperation({
    summary: 'Get companyStaff by Id',
  })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyStaffApiService.findOne(id);
  }

  @ApiOperation({
    summary: 'Create new companyStaff',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Post()
  async create(@Body() companyStaffCreateDto: CompanyStaffCreateDto) {
    return await this.companyStaffApiService.create(companyStaffCreateDto);
  }

  @ApiOperation({
    summary: 'Update companyStaff information',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Patch()
  async update(@Body() companyStaffUpdateDto: CompanyStaffUpdateDto) {
    return await this.companyStaffApiService.update(companyStaffUpdateDto);
  }

  @ApiOperation({
    summary: 'Delete companyStaff',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Delete()
  async delete(@Body() companyStaffDeleteDto: CompanyStaffDeleteDto) {
    return await this.companyStaffApiService.delete(companyStaffDeleteDto);
  }
}
