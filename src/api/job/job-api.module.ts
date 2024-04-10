import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { JobApiController } from './job-api.controller';
import { JobApiService } from './job-api.service';

@Module({
  controllers: [JobApiController],
  providers: [JobApiService, PrismaService],
  exports: [JobApiService],
})
export class JobApiModule { }
