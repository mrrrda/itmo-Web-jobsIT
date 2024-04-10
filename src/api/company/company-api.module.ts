import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { CompanyApiController } from './company-api.controller';
import { CompanyApiService } from './company-api.service';

@Module({
  controllers: [CompanyApiController],
  providers: [CompanyApiService, PrismaService],
  exports: [CompanyApiService],
})
export class CompanyApiModule { }
