import { ApiProperty } from '@nestjs/swagger';

export class StatsDetailsResponse {
  @ApiProperty()
  country: string;

  @ApiProperty()
  numberOfCompanies: number;

  @ApiProperty()
  numberOfEmployees: number;

  @ApiProperty()
  totalUsers: number;
}
