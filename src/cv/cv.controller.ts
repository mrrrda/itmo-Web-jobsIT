import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CvService } from './cv.service';

@ApiTags('CVs')
@Controller('cvs')
export class CvController {
  constructor(private readonly cvService: CvService) { }
}
