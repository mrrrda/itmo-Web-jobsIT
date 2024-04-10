import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from 'src/company';
import { CvModule } from 'src/cv';
import { JobModule } from 'src/job';
import { ApplicationModule } from 'src/application';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ApplicationApiModule } from './api/application';
import { CompanyApiModule } from './api/company';
import { CvApiModule } from './api/cv';
import { JobApiModule } from './api/job';
import { UserApiModule } from './api/user';
import { ApplicantApiModule } from './api/applicant';
import { CompanyStaffApiModule } from './api/companyStaff';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ApplicationApiModule,
    CompanyApiModule,
    CvApiModule,
    JobApiModule,
    UserApiModule,
    ApplicantApiModule,
    CompanyStaffApiModule,
    ApplicationModule,
    CompanyModule,
    CvModule,
    JobModule,
    ChatModule,
    AuthModule.forRoot({
      connectionURI: process.env.CONNECTION_URI,
      apiKey: process.env.API_KEY,
      appInfo: {
        appName: 'jobs-it',
        apiDomain: process.env.API_DOMAIN,
        websiteDomain: process.env.WEBSITE_DOMAIN,
        apiBasePath: '/api/auth',
        websiteBasePath: '/auth',
      },
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
