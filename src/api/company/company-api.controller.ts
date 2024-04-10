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

import { CompanyApiService } from './company-api.service';
import {
  CompanyCreateDto,
  CompanyDeleteDto,
  CompanyUpdateDto,
  CompanyLocationCreateDto,
  CompanyLocationDeleteDto,
  CompanyLocationUpdateDto,
  CompanyDto,
} from './dto';

@ApiTags('Companies API')
@Controller('api/companies')
export class CompanyApiController {
  constructor(private readonly companyApiService: CompanyApiService) { }

  @ApiOperation({
    summary: 'Get company by Id',
  })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.companyApiService.findOne(id);
  }

  @ApiOperation({
    summary: 'Get companies list',
  })
  @ApiBadRequestResponse({
    description: 'Invalid query params response',
  })
  @Get()
  @UseGuards(
    new ListQueryFilterGuard<CompanyDto>({
      entityName: CompanyDto.name,
      filterKeys: ['id', 'name'],
    }),
  )
  async findMany(@Query() params: FindManyQueryParams) {
    return await this.companyApiService.findMany(params);
  }

  @ApiOperation({
    summary: 'Create new company',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Post()
  async create(@Body() companyCreateDto: CompanyCreateDto) {
    return await this.companyApiService.create(companyCreateDto);
  }

  @ApiOperation({
    summary: 'Update existing company',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Patch()
  async update(@Body() companyUpdateDto: CompanyUpdateDto) {
    return await this.companyApiService.update(companyUpdateDto);
  }

  @ApiOperation({
    summary: 'Delete company',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Delete()
  async delete(@Body() companyDeleteDto: CompanyDeleteDto) {
    return await this.companyApiService.delete(companyDeleteDto);
  }

  @ApiOperation({
    summary: 'Add company location',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Post(':id/locations')
  async addLocation(@Body() companyLocationCreateDto: CompanyLocationCreateDto) {
    return await this.companyApiService.addLocation(companyLocationCreateDto);
  }

  @ApiOperation({
    summary: 'Update existing company location',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Patch(':id/locations')
  async updateLocation(@Body() companyLocationUpdateDto: CompanyLocationUpdateDto) {
    return await this.companyApiService.updateLocation(companyLocationUpdateDto);
  }

  @ApiOperation({
    summary: 'Delete company location',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @Delete(':id/locations')
  async deleteLocation(@Body() companyLocationDeleteDto: CompanyLocationDeleteDto) {
    return await this.companyApiService.deleteLocation(companyLocationDeleteDto);
  }
}
