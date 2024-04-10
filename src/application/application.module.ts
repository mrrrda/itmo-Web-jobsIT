import { Module } from '@nestjs/common';
import { ApplicationApiModule } from 'src/api/application';

import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';

@Module({
  imports: [ApplicationApiModule],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule { }
