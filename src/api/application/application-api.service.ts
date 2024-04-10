import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FindManyQueryParams } from 'src/common/dto';
import { Application, ApplicationStatus, Prisma } from '@prisma/client';
import { Enum, composePrismaFilter } from 'src/common/utils';

import { ApplicationCreateDto, ApplicationUpdateDto, ApplicationDeleteDto } from './dto';

@Injectable()
export class ApplicationApiService {
  constructor(private prismaService: PrismaService) { }

  async findOne(id: number) {
    return await this.prismaService.application.findUnique({ where: { id } });
  }

  async findMany(params: FindManyQueryParams) {
    const applicationFindManyInput: Prisma.ApplicationFindManyArgs = {};

    if (params.filter) {
      applicationFindManyInput.where = composePrismaFilter<
        Application,
        Prisma.ApplicationWhereInput
      >(params.filter, {
        id: Number,
        jobItemId: Number,
        cvId: Number,
        status: Enum,
      });
    }

    if (params.pagination) {
      applicationFindManyInput.skip = params.pagination.skip;
      applicationFindManyInput.take = params.pagination.first;
    }

    if (params.sort) {
      applicationFindManyInput.orderBy = params.sort.map(sortOption => ({
        [sortOption.key]: sortOption.order,
      }));
    }

    return await this.prismaService.application.findMany(applicationFindManyInput);
  }

  async create(applicationCreateDto: ApplicationCreateDto) {
    return await this.prismaService.application.create({ data: applicationCreateDto });
  }

  async update(applicationUpdateDto: ApplicationUpdateDto) {
    const { id, ...data } = applicationUpdateDto;
    return await this.prismaService.application.update({ where: { id }, data });
  }

  async delete(applicationDeleteDto: ApplicationDeleteDto) {
    return await this.prismaService.application.delete({ where: { id: applicationDeleteDto.id } });
  }
}
