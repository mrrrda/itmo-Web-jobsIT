import { Module } from '@nestjs/common';
import { JobApiModule } from 'src/api/job';
import { UserApiModule } from 'src/api/user';

import { JobController } from './job.controller';
import { JobService } from './job.service';

@Module({
  imports: [JobApiModule, UserApiModule],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule { }
