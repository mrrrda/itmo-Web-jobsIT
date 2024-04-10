import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';
import { IsNonNegativeInt } from 'src/common/decorators';

export class UserDto {
  @ApiProperty({
    description: 'User id',
  })
  @IsNonNegativeInt()
  id: number;

  @ApiProperty({
    description: 'User authentication id',
  })
  @IsString()
  authId: string;

  @ApiProperty({
    description: 'Applicant id',
  })
  @IsNonNegativeInt()
  applicantId: number;

  @ApiProperty({
    description: 'Company staff id',
  })
  @IsNonNegativeInt()
  companyStaffId: number;

  @ApiProperty({
    description: 'User email',
    example: 'user@email.com',
  })
  @IsString()
  readonly email: string;

  // TODO: Remove
  @IsString()
  readonly password: string;

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @ApiProperty({
    description: 'User role within the platform',
    example: Role.APPLICANT,
  })
  @IsEnum(Role)
  readonly role: Role;
}

export class UserCreateDto extends OmitType(UserDto, ['id', 'applicantId', 'companyStaffId']) { }

export class UserUpdateDto extends PartialType(OmitType(UserDto, ['authId', 'role'])) {
  @ApiProperty({
    description: 'User id',
  })
  @IsNonNegativeInt()
  id: number;
}

export class UserDeleteDto extends PartialType(
  PickType(UserDto, ['id', 'applicantId', 'companyStaffId']),
) { }
