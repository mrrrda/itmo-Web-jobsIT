import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { UserCreateDto, UserDeleteDto, UserUpdateDto } from './dto';

@Injectable()
export class UserApiService {
  constructor(private prismaService: PrismaService) { }

  async findOne(id: number) {
    return await this.prismaService.user.findUnique({ where: { id } });
  }

  async findCurrentUser(authId: string | undefined) {
    if (!authId) {
      return undefined;
    }

    return await this.prismaService.user.findUnique({ where: { authId } });
  }

  async create(userCreateDto: UserCreateDto) {
    return await this.prismaService.user.create({ data: userCreateDto });
  }

  async update(userUpdateDto: UserUpdateDto) {
    const { id, ...data } = userUpdateDto;
    return await this.prismaService.user.update({ where: { id }, data });
  }

  async delete(userDeleteDto: UserDeleteDto) {
    if (userDeleteDto.id) {
      return await this.prismaService.user.delete({ where: { id: userDeleteDto.id } });
    }

    const users = await this.prismaService.user.findMany({
      where: {
        ...(userDeleteDto.applicantId
          ? { applicant: { id: userDeleteDto.applicantId } }
          : undefined),
        ...(userDeleteDto.companyStaffId
          ? { companyStaff: { id: userDeleteDto.companyStaffId } }
          : undefined),
      },
    });

    if (users.length !== 1) {
      throw new BadRequestException('Failed to delete the user by given criteria');
    }

    return await this.prismaService.user.delete({ where: { id: users[0].id } });
  }
}
