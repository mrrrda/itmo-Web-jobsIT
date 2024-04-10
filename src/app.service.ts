import { Injectable } from '@nestjs/common';

import { CvApiService } from './api/cv';
import { ApplicantApiService } from './api/applicant';
import { CompanyApiService } from './api/company';

@Injectable()
export class AppService {
  constructor(
    private readonly cvApiService: CvApiService,
    private readonly applicantApiService: ApplicantApiService,
    private readonly companyApiService: CompanyApiService,
  ) { }

  getAdministratorData() {
    return {
      firstName: 'Mariya',
      lastName: 'Izerakova',
      role: 'Administrator',
      email: 'mariyordab@gmail.com',
      phoneNumber: '+111 111 111',
    };
  }

  async getStats() {
    const stats = await Promise.all([
      this.cvApiService.count(),
      this.applicantApiService.count(),
      this.companyApiService.count(),
    ]);

    return [
      { entity: 'CVs', count: stats[0] },
      { entity: 'Employees', count: stats[1] },
      { entity: 'Companies', count: stats[2] },
    ];
  }

  getStatsAvatars() {
    return [
      { src: './images/Avatar-1.webp' },
      { src: './images/Avatar-2.webp' },
      { src: './images/Avatar-3.webp' },
      { src: './images/Avatar-4.webp' },
    ];
  }

  getStatsDetails() {
    return [
      {
        country: 'Russia',
        numberOfCompanies: 100,
        numberOfEmployees: 50,
        totalUsers: 150,
      },
      {
        country: 'Serbia',
        numberOfCompanies: 200,
        numberOfEmployees: 20,
        totalUsers: 220,
      },
      {
        country: 'Finland',
        numberOfCompanies: 200,
        numberOfEmployees: 20,
        totalUsers: 220,
      },
      {
        country: 'USA',
        numberOfCompanies: 500,
        numberOfEmployees: 50,
        totalUsers: 550,
      },
      {
        country: 'France',
        numberOfCompanies: 500,
        numberOfEmployees: 50,
        totalUsers: 550,
      },
      {
        country: 'Ukraine',
        numberOfCompanies: 500,
        numberOfEmployees: 50,
        totalUsers: 550,
      },
      {
        country: 'Poland',
        numberOfCompanies: 500,
        numberOfEmployees: 50,
        totalUsers: 550,
      },
    ];
  }
}
