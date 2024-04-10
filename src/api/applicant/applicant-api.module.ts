import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { ApplicantApiController } from './applicant-api.controller';
import { ApplicantApiService } from './applicant-api.service';
import { UserApiModule } from '../user';

@Module({
  imports: [UserApiModule],
  controllers: [ApplicantApiController],
  providers: [ApplicantApiService, PrismaService],
  exports: [ApplicantApiService],
})
export class ApplicantApiModule { }
