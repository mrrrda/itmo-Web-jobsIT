import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { WorkPlace, WorkSchedule, Experience, Education } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';
import { IsNonNegativeInt } from 'src/common/decorators';

export class JobDto {
  @ApiProperty({
    description: 'Job item id',
  })
  @IsNonNegativeInt()
  readonly id: number;

  @ApiProperty({
    description: 'Job title',
  })
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Brief job information',
  })
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: 'Id of the company location the job is sought for',
  })
  @IsNonNegativeInt()
  readonly locationId: number;

  @ApiProperty({
    description: 'Job location',
  })
  @IsString()
  readonly location: string;

  @ApiProperty({
    description: 'Required experience level',
    example: Experience.SENIOR,
  })
  @IsString()
  readonly experience: Experience;

  @ApiProperty({
    description: 'Education level of the applicant',
    example: Education.BACHELORS,
  })
  @IsString()
  readonly education: Education;

  @ApiProperty({
    description: 'Minimum offered salary',
    minimum: 0,
  })
  @IsNonNegativeInt()
  readonly minSalary: number;

  @ApiProperty({
    description: 'Maximum offered salary',
  })
  @IsNonNegativeInt()
  readonly maxSalary: number;

  @ApiProperty({
    description: 'Implied work schedule',
    example: WorkSchedule.FIXED,
  })
  @IsEnum(WorkSchedule)
  readonly workSchedule: WorkSchedule;

  @ApiProperty({
    description: 'Implied work place',
    example: WorkPlace.OFFICE,
  })
  @IsEnum(WorkPlace)
  readonly workPlace: WorkPlace;
}

export class JobCreateDto extends PartialType(OmitType(JobDto, ['id', 'location'])) {
  @ApiProperty({
    description: 'Job title',
  })
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Brief job information',
  })
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: 'Required experience level',
    example: Experience.SENIOR,
  })
  @IsString()
  readonly experience: Experience;

  @ApiProperty({
    description: 'Minimum offered salary',
    minimum: 0,
  })
  @IsNonNegativeInt()
  readonly minSalary: number;

  @ApiProperty({
    description: 'Id of the company location the job is sought for',
  })
  @IsNonNegativeInt()
  readonly locationId: number;
}

export class JobUpdateDto extends PartialType(OmitType(JobDto, ['location'])) {
  @ApiProperty({
    description: 'Job item id',
  })
  @IsNonNegativeInt()
  readonly id: number;
}

export class JobDeleteDto extends PickType(OmitType(JobDto, ['location']), ['id']) { }
