import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNonNegativeInt } from 'src/common/decorators';

export class CompanyStaffDto {
  @ApiProperty({
    description: 'Company staff id',
  })
  @IsNonNegativeInt()
  id: number;

  @ApiProperty({
    description: 'Company staff authentication id',
  })
  @IsString()
  authId: string;

  @ApiProperty({
    description: 'Company id',
  })
  @IsNonNegativeInt()
  companyId: number;

  @ApiProperty({
    description: 'Company staff email',
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

export class CompanyStaffCreateDto extends OmitType(CompanyStaffDto, ['id']) { }

export class CompanyStaffUpdateDto extends PartialType(OmitType(CompanyStaffDto, ['authId'])) {
  @ApiProperty({
    description: 'Company staff id',
  })
  @IsNonNegativeInt()
  id: number;
}

export class CompanyStaffDeleteDto extends PickType(CompanyStaffDto, ['id']) { }
