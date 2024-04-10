import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';
import { IsNonNegativeInt } from 'src/common/decorators';

export class CompanyLocationDto {
  @ApiProperty({
    description: 'Company location id',
  })
  @IsNonNegativeInt()
  readonly id: number;

  @ApiProperty({
    description: 'Company id',
  })
  @IsNonNegativeInt()
  readonly companyId: number;

  @IsNumberString()
  readonly zip: string;

  @IsString()
  readonly country: string;

  @IsString()
  readonly city: string;

  @ApiProperty({
    description: 'Building, street',
    example: '2896 Christie Way',
  })
  readonly address: string;
}

export class CompanyLocationCreateDto extends PartialType(OmitType(CompanyLocationDto, ['id'])) { }

export class CompanyLocationUpdateDto extends PartialType(
  OmitType(CompanyLocationDto, ['companyId']),
) {
  @ApiProperty({
    description: 'Company location id',
  })
  @IsNonNegativeInt()
  readonly id: number;
}

export class CompanyLocationDeleteDto extends PickType(CompanyLocationDto, ['id']) { }
