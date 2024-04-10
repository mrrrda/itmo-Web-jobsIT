import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Education, Experience, WorkPlace, WorkSchedule } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsString } from 'class-validator';
import { IsNonNegativeInt } from 'src/common/decorators';

export class CvDto {
  @ApiProperty({
    description: 'CV id',
  })
  @IsNonNegativeInt()
  readonly id: number;

  @ApiProperty({
    description: 'Id of the applicant the CV belongs to',
  })
  @IsNonNegativeInt()
  readonly applicantId: number;

  @ApiProperty({
    description: 'Country of residence',
  })
  @IsString()
  readonly country: string;

  @ApiProperty({
    description: 'Job position for which the applicant wants to apply',
    example: 'Front-end developer',
  })
  @IsString()
  readonly position: string;

  @ApiProperty({
    description: 'Experience level of the applicant',
    example: Experience.INTERN,
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
    description: 'Minimum desired salary',
  })
  @IsNonNegativeInt()
  readonly minSalary: number;

  @ApiProperty({
    description: 'Maximum desired salary',
  })
  @IsNonNegativeInt()
  readonly maxSalary: number;

  @ApiProperty({
    description: 'Professional qualities of the applicant',
    example: 'Leadership, problem-solving, communication skills',
  })
  @IsArray()
  @Type(() => String)
  readonly skills: string[];

  @ApiProperty({
    description: 'Desired work schedule',
    example: WorkSchedule.FLEXIBLE,
  })
  @IsEnum(WorkSchedule)
  readonly workSchedule: WorkSchedule;

  @ApiProperty({
    description: 'Desired work place',
    example: WorkPlace.REMOTE,
  })
  @IsEnum(WorkPlace)
  readonly workPlace: WorkPlace;
}

export class CvCreateDto extends PartialType(OmitType(CvDto, ['id'])) {
  @ApiProperty({
    description: 'Id of the applicant the CV belongs to',
  })
  @IsNonNegativeInt()
  readonly applicantId: number;

  @ApiProperty({
    description: 'Job position for which the applicant wants to apply',
    example: 'Front-end developer',
  })
  @IsString()
  readonly position: string;

  @ApiProperty({
    description: 'Country of residence',
  })
  @IsString()
  readonly country: string;

  @ApiProperty({
    description: 'Experience level of the applicant',
    example: Experience.INTERN,
  })
  @IsString()
  readonly experience: Experience;
}

export class CvUpdateDto extends PartialType(OmitType(CvDto, ['applicantId'])) {
  @ApiProperty({
    description: 'CV id',
  })
  @IsNonNegativeInt()
  readonly id: number;
}

export class CvDeleteDto extends PickType(CvDto, ['id']) { }
