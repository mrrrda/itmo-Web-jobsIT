import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApplicationService } from './application.service';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) { }
}
