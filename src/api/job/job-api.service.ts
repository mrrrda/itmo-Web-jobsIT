import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FindManyQueryParams } from 'src/common/dto';
import { JobItem, Prisma, WorkPlace, WorkSchedule, Education, Experience } from '@prisma/client';
import { Enum, composePrismaFilter } from 'src/common/utils';

import { JobCreateDto, JobUpdateDto, JobDeleteDto } from './dto';

@Injectable()
export class JobApiService {
  constructor(private prismaService: PrismaService) { }

  async findOne(id: number) {
    return await this.prismaService.jobItem.findUnique({ where: { id } });
  }

  async findMany(params: FindManyQueryParams) {
    const jobItemFindManyInput: Prisma.JobItemFindManyArgs = {};

    if (params.filter) {
      jobItemFindManyInput.where = composePrismaFilter<
        JobItem & { location: Prisma.CompanyLocationWhereInput },
        Prisma.JobItemWhereInput
      >(params.filter, {
        id: Number,
        locationId: Number,
        title: String,
        education: Enum,
        experience: Enum,
        minSalary: Number,
        maxSalary: Number,
        workPlace: Enum,
        workSchedule: Enum,
        location: (location: string): Prisma.CompanyLocationWhereInput => ({
          address: {
            OR: [
              {
                country: {
                  contains: location,
                  mode: 'insensitive',
                },
              },
              {
                city: {
                  contains: location,
                  mode: 'insensitive',
                },
              },
            ],
          },
        }),
      });
    }

    if (params.pagination) {
      jobItemFindManyInput.skip = params.pagination.skip;
      jobItemFindManyInput.take = params.pagination.first;
    }

    if (params.sort) {
      jobItemFindManyInput.orderBy = params.sort.map(sortOption => ({
        [sortOption.key]: sortOption.order,
      }));
    }

    jobItemFindManyInput.include = {
      location: {
        include: {
          company: true,
          address: true,
        },
      },
    };

    return await this.prismaService.jobItem.findMany(jobItemFindManyInput);
  }

  async create(jobCreateDto: JobCreateDto) {
    const { locationId, ...data } = jobCreateDto;
    const jobCreateInput: Prisma.JobItemCreateInput = {
      ...data,
      location: {
        connect: { id: locationId },
      },
    };
    return await this.prismaService.jobItem.create({ data: jobCreateInput });
  }

  async update(jobUpdateDto: JobUpdateDto) {
    const { id, ...data } = jobUpdateDto;
    return await this.prismaService.jobItem.update({ where: { id }, data });
  }

  async delete(jobDeleteDto: JobDeleteDto) {
    return await this.prismaService.jobItem.delete({ where: { id: jobDeleteDto.id } });
  }
}
