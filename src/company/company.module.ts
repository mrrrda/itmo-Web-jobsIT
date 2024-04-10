import { Module } from '@nestjs/common';
import { CompanyApiModule } from 'src/api/company';

import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  imports: [CompanyApiModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule { }
