import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { ApplicationApiService } from './application-api.service';
import { ApplicationApiController } from './application-api.controller';

@Module({
  controllers: [ApplicationApiController],
  providers: [ApplicationApiService, PrismaService],
  exports: [ApplicationApiService],
})
export class ApplicationApiModule { }
