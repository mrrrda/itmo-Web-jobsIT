import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FindManyQueryParams } from 'src/common/dto';
import { Cv, Education, Experience, Prisma, WorkPlace, WorkSchedule } from '@prisma/client';
import { Enum, composePrismaFilter } from 'src/common/utils';

import { CvCreateDto, CvUpdateDto, CvDeleteDto } from './dto';

@Injectable()
export class CvApiService {
  constructor(private prismaService: PrismaService) { }

  async count() {
    return await this.prismaService.cv.count();
  }

  async findOne(id: number) {
    return await this.prismaService.cv.findUnique({ where: { id } });
  }

  async findMany(params: FindManyQueryParams) {
    const cvFindManyInput: Prisma.CvFindManyArgs = {};

    if (params.filter) {
      cvFindManyInput.where = composePrismaFilter<Cv, Prisma.CvWhereInput>(params.filter, {
        id: Number,
        applicantId: Number,
        country: String,
        position: String,
        education: Enum,
        experience: Enum,
        minSalary: Number,
        maxSalary: Number,
        workPlace: Enum,
        workSchedule: Enum,
      });
    }

    if (params.pagination) {
      cvFindManyInput.skip = params.pagination.skip;
      cvFindManyInput.take = params.pagination.first;
    }

    if (params.sort) {
      cvFindManyInput.orderBy = params.sort.map(sortOption => ({
        [sortOption.key]: sortOption.order,
      }));
    }

    return await this.prismaService.cv.findMany(cvFindManyInput);
  }

  async create(cvCreateDto: CvCreateDto) {
    const { applicantId, ...data } = cvCreateDto;
    const cvCreateInput: Prisma.CvCreateInput = {
      ...data,
      applicant: {
        connect: { id: applicantId },
      },
    };
    return await this.prismaService.cv.create({ data: cvCreateInput });
  }

  async update(cvUpdateDto: CvUpdateDto) {
    const { id, ...data } = cvUpdateDto;
    return await this.prismaService.cv.update({ where: { id }, data });
  }

  async delete(cvDeleteDto: CvDeleteDto) {
    return await this.prismaService.cv.delete({ where: { id: cvDeleteDto.id } });
  }
}
