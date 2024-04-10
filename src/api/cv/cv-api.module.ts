import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { CvApiController } from './cv-api.controller';
import { CvApiService } from './cv-api.service';

@Module({
  controllers: [CvApiController],
  providers: [CvApiService, PrismaService],
  exports: [CvApiService],
})
export class CvApiModule { }
