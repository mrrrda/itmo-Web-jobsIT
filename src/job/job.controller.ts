import { Controller, Get, Query, Render, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JobDto } from 'src/api/job/dto';
import { FindManyQueryParams } from 'src/common/dto';
import { ListQueryFilterGuard } from 'src/common/guards';
import { JobApiService } from 'src/api/job';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { Session } from 'src/auth/session';
import { UserApiService } from 'src/api/user';

import { JobService } from './job.service';

@ApiTags('Jobs')
@Controller()
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly jobApiService: JobApiService,
    private readonly userApiService: UserApiService,
  ) { }

  @ApiOperation({
    summary: 'Get jobs list',
  })
  @ApiBadRequestResponse({
    description: 'Invalid query params response',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized',
  })
  @Get('jobs-search')
  @UseGuards(
    new ListQueryFilterGuard<JobDto>({
      entityName: JobDto.name,
      filterKeys: [
        'id',
        'title',
        'location',
        'experience',
        'education',
        'maxSalary',
        'minSalary',
        'workPlace',
        'workSchedule',
      ],
    }),
  )
  @Render('jobs-search')
  async jobsSearch(@Session() session: SessionContainer, @Query() params: FindManyQueryParams) {
    const authId = session?.getUserId();
    const userInformation = await this.userApiService.findCurrentUser(authId);

    const jobs = await this.jobApiService.findMany(params);
    return { userInformation, jobs };
  }
}
