import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CvApiModule } from 'src/api/cv';

import { CvController } from './cv.controller';
import { CvService } from './cv.service';

@Module({
  imports: [CvApiModule],
  controllers: [CvController],
  providers: [CvService, PrismaService],
})
export class CvModule { }
