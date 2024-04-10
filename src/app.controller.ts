import { Controller, Get, Header, Render, UseInterceptors, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from 'src/app.service';
import { ResponseTimeInterceptor } from 'src/common/interceptors';
import { StatsDetailsResponse } from 'src/common/dto';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { Session } from './auth/session/';
import { UserApiService } from './api/user';

@ApiTags('Application Root')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userApiService: UserApiService,
  ) { }

  @ApiOperation({
    summary: 'Render home page',
  })
  @ApiOkResponse({
    description: 'HTML content of the Home page',
  })
  @UseInterceptors(ResponseTimeInterceptor)
  @Get('/')
  @Render('index')
  async root(@Session() session: SessionContainer) {
    const authId = session?.getUserId();
    const userInformation = await this.userApiService.findCurrentUser(authId);

    const stats = await this.appService.getStats();

    return {
      stats,
      usersAvatars: this.appService.getStatsAvatars(),
      userInformation,
    };
  }

  @ApiOperation({
    summary: 'Render about page',
  })
  @ApiOkResponse({
    description: 'HTML content of the About page',
  })
  @UseInterceptors(ResponseTimeInterceptor)
  @Get('/about')
  @Render('about')
  async about(@Session() session: SessionContainer) {
    const authId = session?.getUserId();
    const userInformation = await this.userApiService.findCurrentUser(authId);

    const stats = await this.appService.getStats();

    return {
      stats,
      userInformation,
      usersAvatars: this.appService.getStatsAvatars(),
      contacts: this.appService.getAdministratorData(),
    };
  }

  @ApiOperation({
    summary: 'Render stats page',
  })
  @ApiOkResponse({
    description: 'HTML content of the Stats page',
  })
  @UseInterceptors(ResponseTimeInterceptor)
  @Get('/stats')
  @Render('stats')
  async stats(@Session() session: SessionContainer) {
    const authId = session?.getUserId();
    const userInformation = await this.userApiService.findCurrentUser(authId);

    return { userInformation };
  }

  @ApiOperation({
    summary: 'Get aggregated statistics details',
  })
  @ApiOkResponse({
    description: 'Aggregated statistics details JSON',
    type: StatsDetailsResponse,
    isArray: true,
  })
  @Get('/stats/details')
  @Header('Content-Type', 'application/json')
  statsDetails() {
    return this.appService.getStatsDetails();
  }

  @ApiOperation({
    summary: 'Render Sign in page',
  })
  @ApiOkResponse({
    description: 'HTML content of the Sign in page',
  })
  @UseInterceptors(ResponseTimeInterceptor)
  @Get('/sign-in')
  @Render('sign-in')
  async signIn(@Session() session: SessionContainer) {
    const authId = session?.getUserId();
    const userInformation = await this.userApiService.findCurrentUser(authId);

    return { userInformation };
  }

  @ApiOperation({
    summary: 'Render Sign up page',
  })
  @ApiOkResponse({
    description: 'HTML content of the Sign up page',
  })
  @UseInterceptors(ResponseTimeInterceptor)
  @Get('/sign-up')
  @Render('sign-up')
  async signUp(@Session() session: SessionContainer) {
    const authId = session?.getUserId();
    const userInformation = await this.userApiService.findCurrentUser(authId);

    return { userInformation };
  }

  @Get('/sign-out')
  async signOut(@Session() session: SessionContainer, @Res() response) {
    await session.revokeSession();
    response.redirect('/');
  }
}
