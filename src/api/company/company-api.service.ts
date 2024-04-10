import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FindManyQueryParams } from 'src/common/dto';
import { Company, Prisma } from '@prisma/client';
import { composePrismaFilter } from 'src/common/utils';

import {
  CompanyCreateDto,
  CompanyUpdateDto,
  CompanyDeleteDto,
  CompanyLocationCreateDto,
  CompanyLocationUpdateDto,
  CompanyLocationDeleteDto,
} from './dto';

@Injectable()
export class CompanyApiService {
  constructor(private prismaService: PrismaService) { }

  async count() {
    return await this.prismaService.company.count();
  }

  async findOne(id: number) {
    return await this.prismaService.company.findUnique({
      where: { id },
      include: {
        locations: {
          include: {
            address: true,
          },
        },
      },
    });
  }

  async findMany(params: FindManyQueryParams) {
    const companyFindManyInput: Prisma.CompanyFindManyArgs = {};

    if (params.filter) {
      companyFindManyInput.where = composePrismaFilter<Company, Prisma.CompanyWhereInput>(
        params.filter,
        {
          id: Number,
          name: String,
        },
      );
    }

    if (params.pagination) {
      companyFindManyInput.skip = params.pagination.skip;
      companyFindManyInput.take = params.pagination.first;
    }

    if (params.sort) {
      companyFindManyInput.orderBy = params.sort.map(sortOption => ({
        [sortOption.key]: sortOption.order,
      }));
    }

    return await this.prismaService.company.findMany(companyFindManyInput);
  }

  async create(companyCreateDto: CompanyCreateDto) {
    return await this.prismaService.company.create({ data: companyCreateDto });
  }

  async update(companyUpdateDto: CompanyUpdateDto) {
    const { id, ...data } = companyUpdateDto;
    return await this.prismaService.company.update({ where: { id }, data });
  }

  async delete(companyDeleteDto: CompanyDeleteDto) {
    return await this.prismaService.company.delete({ where: { id: companyDeleteDto.id } });
  }

  async addLocation(companyLocationCreateDto: CompanyLocationCreateDto) {
    const companyLocationCreateInput: Prisma.CompanyLocationCreateInput = {
      company: { connect: { id: companyLocationCreateDto.companyId } },
      address: {
        create: {
          zip: companyLocationCreateDto.zip,
          country: companyLocationCreateDto.country,
          city: companyLocationCreateDto.city,
          address: companyLocationCreateDto.address,
        },
      },
    };
    return await this.prismaService.companyLocation.create({ data: companyLocationCreateInput });
  }

  async updateLocation(companyLocationUpdateDto: CompanyLocationUpdateDto) {
    const companyLocationUpdateInput: Prisma.CompanyLocationUpdateInput = {
      address: {
        update: {
          zip: companyLocationUpdateDto.zip,
          country: companyLocationUpdateDto.country,
          city: companyLocationUpdateDto.city,
          address: companyLocationUpdateDto.address,
        },
      },
    };
    return await this.prismaService.companyLocation.update({
      where: { id: companyLocationUpdateDto.id },
      data: companyLocationUpdateInput,
    });
  }

  async deleteLocation(companyLocationDeleteDto: CompanyLocationDeleteDto) {
    return await this.prismaService.companyLocation.delete({
      where: { id: companyLocationDeleteDto.id },
    });
  }
}
