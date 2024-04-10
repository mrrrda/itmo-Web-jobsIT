import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNonNegativeInt } from 'src/common/decorators';

export class ApplicantDto {
  @ApiProperty({
    description: 'Applicant id',
  })
  @IsNonNegativeInt()
  id: number;

  @ApiProperty({
    description: 'Applicant authentication id',
  })
  @IsString()
  authId: string;

  @ApiProperty({
    description: 'Applicant email',
    example: 'user@email.com',
  })
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;
}

export class ApplicantCreateDto extends OmitType(ApplicantDto, ['id']) { }

export class ApplicantUpdateDto extends PartialType(OmitType(ApplicantDto, ['authId'])) {
  @ApiProperty({
    description: 'Applicant id',
  })
  @IsNonNegativeInt()
  id: number;
}

export class ApplicantDeleteDto extends PickType(ApplicantDto, ['id']) { }
