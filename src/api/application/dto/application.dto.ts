import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { ApplicationStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { IsNonNegativeInt } from 'src/common/decorators';

export class ApplicationDto {
  @ApiProperty({
    description: 'Application id',
  })
  @IsNonNegativeInt()
  readonly id: number;

  @ApiProperty({
    description: 'Id of the job the application is submitted for',
  })
  @IsNonNegativeInt()
  readonly jobItemId: number;

  @ApiProperty({
    description: 'Id of the CV attached to the application',
  })
  @IsNonNegativeInt()
  readonly cvId: number;

  @ApiProperty({
    description: 'Status of the application',
    example: ApplicationStatus.SUBMITTED,
  })
  @IsEnum(ApplicationStatus)
  readonly status: ApplicationStatus;
}

export class ApplicationCreateDto extends OmitType(ApplicationDto, ['id', 'status']) { }

export class ApplicationUpdateDto extends PartialType(
  OmitType(ApplicationDto, ['cvId', 'jobItemId']),
) {
  @ApiProperty({
    description: 'Application id',
  })
  @IsNonNegativeInt()
  readonly id: number;
}

export class ApplicationDeleteDto extends PickType(ApplicationDto, ['id']) { }
