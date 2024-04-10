import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IsNonNegativeInt } from 'src/common/decorators';

export class CompanyDto {
  @ApiProperty({
    description: 'Company id',
  })
  @IsNonNegativeInt()
  readonly id: number;

  @ApiProperty({
    description: 'Company name',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Brief company information',
  })
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: 'Company logo URL',
    example: 'https://placehold.co/600x400',
  })
  @IsOptional()
  @IsString()
  readonly logo?: string;
}

export class CompanyCreateDto extends OmitType(CompanyDto, ['id', 'description']) { }

export class CompanyUpdateDto extends PartialType(CompanyDto) {
  @ApiProperty({
    description: 'Company id',
  })
  @IsNonNegativeInt()
  readonly id: number;
}

export class CompanyDeleteDto extends PickType(CompanyDto, ['id']) { }
