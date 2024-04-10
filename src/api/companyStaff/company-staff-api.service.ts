import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Role } from '@prisma/client';

import { CompanyStaffCreateDto, CompanyStaffDeleteDto, CompanyStaffUpdateDto } from './dto';
import { UserCreateDto, UserDeleteDto } from '../user/dto';
import { UserApiService } from '../user';

@Injectable()
export class CompanyStaffApiService {
  constructor(
    private prismaService: PrismaService,
    private userApiService: UserApiService,
  ) { }

  async findOne(id: number) {
    return await this.prismaService.companyStaff.findUnique({ where: { id } });
  }

  async create(companyStaffCreateDto: CompanyStaffCreateDto) {
    const { companyId, ...data } = companyStaffCreateDto;

    const userCreateDto: UserCreateDto = {
      ...data,
      role: Role.EMPLOYER,
    };

    const user = await this.userApiService.create(userCreateDto);

    const companyStaffCreateInput: Prisma.CompanyStaffCreateInput = {
      user: { connect: { id: user.id } },
      company: { connect: { id: companyId } },
    };

    return await this.prismaService.companyStaff.create({ data: companyStaffCreateInput });
  }

  async update(companyStaffUpdateDto: CompanyStaffUpdateDto) {
    const { id, ...data } = companyStaffUpdateDto;
    const companyStaffUpdateInput: Prisma.CompanyStaffUpdateInput = {
      user: {
        update: { ...data },
      },
    };

    return await this.prismaService.applicant.update({
      where: { id },
      data: companyStaffUpdateInput,
    });
  }

  async delete(companyStaffDeleteDto: CompanyStaffDeleteDto) {
    const userDeleteDto: UserDeleteDto = {
      companyStaffId: companyStaffDeleteDto.id,
    };

    return await this.userApiService.delete(userDeleteDto);
  }
}
