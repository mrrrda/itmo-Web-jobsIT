import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Role } from '@prisma/client';

import { ApplicantCreateDto, ApplicantDeleteDto, ApplicantUpdateDto } from './dto';
import { UserApiService } from '../user';
import { UserCreateDto, UserDeleteDto } from '../user/dto';

@Injectable()
export class ApplicantApiService {
  constructor(
    private prismaService: PrismaService,
    private userApiService: UserApiService,
  ) { }

  async count() {
    return await this.prismaService.applicant.count();
  }

  async findOne(id: number) {
    return await this.prismaService.applicant.findUnique({ where: { id } });
  }

  async create(applicantCreateDto: ApplicantCreateDto) {
    const userCreateDto: UserCreateDto = {
      ...applicantCreateDto,
      role: Role.APPLICANT,
    };

    const user = await this.userApiService.create(userCreateDto);

    const applicantCreateInput: Prisma.ApplicantCreateInput = {
      user: { connect: { id: user.id } },
    };

    return await this.prismaService.applicant.create({ data: applicantCreateInput });
  }

  async update(applicantUpdateDto: ApplicantUpdateDto) {
    const { id, ...data } = applicantUpdateDto;
    const applicantUpdateInput: Prisma.ApplicantUpdateInput = {
      user: {
        update: { ...data },
      },
    };

    return await this.prismaService.applicant.update({ where: { id }, data: applicantUpdateInput });
  }

  async delete(applicantDeleteDto: ApplicantDeleteDto) {
    const userDeleteDto: UserDeleteDto = {
      applicantId: applicantDeleteDto.id,
    };

    return await this.userApiService.delete(userDeleteDto);
  }
}
