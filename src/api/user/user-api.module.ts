import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { UserApiController } from './user-api.controller';
import { UserApiService } from './user-api.service';

@Module({
  controllers: [UserApiController],
  providers: [UserApiService, PrismaService],
  exports: [UserApiService],
})
export class UserApiModule { }
