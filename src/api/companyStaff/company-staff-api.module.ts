import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { CompanyStaffApiController } from './company-staff-api.controller';
import { CompanyStaffApiService } from './company-staff-api.service';
import { UserApiModule } from '../user';

@Module({
  imports: [UserApiModule],
  controllers: [CompanyStaffApiController],
  providers: [CompanyStaffApiService, PrismaService],
  exports: [CompanyStaffApiService],
})
export class CompanyStaffApiModule { }
