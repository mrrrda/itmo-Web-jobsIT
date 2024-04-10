import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';

import { IsNestedArray, IsNestedObject, IsNonNegativeInt } from '../decorators';

export class FindManyPaginationQueryParams {
  @ApiPropertyOptional({
    name: 'pagination[first]',
    description: 'Number of first items to take from the resulting set',
  })
  @IsOptional()
  @IsNonNegativeInt()
  readonly first?: number;

  @ApiPropertyOptional({
    name: 'pagination[skip]',
    description: 'Number of items to skip',
  })
  @IsOptional()
  @IsNonNegativeInt()
  readonly skip?: number;
}

export class FindManySortQueryParams {
  @ApiProperty({
    name: 'sort[key]',
    description: 'Sort key',
  })
  @IsString()
  readonly key: string;

  @ApiProperty({
    name: 'sort[order]',
    description: 'Sort order',
    example: Prisma.SortOrder.asc,
  })
  @IsEnum(Prisma.SortOrder)
  readonly order: Prisma.SortOrder;
}

export class FindManyFilterQueryParams {
  @ApiPropertyOptional({
    name: 'filter[key]',
    description: 'Property key to filter by',
  })
  @IsOptional()
  @IsString()
  readonly key?: string;

  @ApiPropertyOptional({
    name: 'filter[or]',
    type: () => [FindManyFilterQueryParams],
    description: 'Array of query filters where at least one condition must be met',
  })
  @IsOptional()
  @IsNestedArray(FindManyFilterQueryParams)
  readonly or?: FindManyFilterQueryParams[];

  @ApiPropertyOptional({
    name: 'filter[and]',
    type: () => [FindManyFilterQueryParams],
    description: 'Array of query filters where all of the conditions must be met',
  })
  @IsOptional()
  @IsNestedArray(FindManyFilterQueryParams)
  readonly and?: FindManyFilterQueryParams[];

  @ApiPropertyOptional({
    name: 'filter[not]',
    type: () => [FindManyFilterQueryParams],
    description: 'Array of query filters where none of the conditions must be met',
  })
  @IsOptional()
  @IsNestedArray(FindManyFilterQueryParams)
  readonly not?: FindManyFilterQueryParams[];

  @ApiPropertyOptional({
    name: 'filter[equals]',
    description: 'Value equals to',
  })
  @IsOptional()
  @IsString()
  readonly equals?: string;

  @ApiPropertyOptional({
    name: 'filter[in]',
    description: 'Value is in',
  })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  readonly in?: string;

  @ApiPropertyOptional({
    name: 'filter[notIn]',
    description: 'Value is not in',
  })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  readonly notIn?: string;

  @ApiPropertyOptional({
    name: 'filter[gt]',
    description: 'Value is greater than',
  })
  @IsOptional()
  @IsNumber()
  readonly gt?: number;

  @ApiPropertyOptional({
    name: 'filter[gte]',
    description: 'Value is greater than or equals to',
  })
  @IsOptional()
  @IsNumber()
  readonly gte?: number;

  @ApiPropertyOptional({
    name: 'filter[lt]',
    description: 'Value is less than',
  })
  @IsOptional()
  @IsNumber()
  readonly lt?: number;

  @ApiPropertyOptional({
    name: 'filter[lte]',
    description: 'Value is less than or equals to',
  })
  @IsOptional()
  @IsNumber()
  readonly lte?: number;

  @ApiPropertyOptional({
    name: 'filter[contains]',
    description: 'Value contains substring',
  })
  @IsOptional()
  @IsString()
  readonly contains?: string;
}

export class FindManyQueryParams {
  @ApiPropertyOptional({
    type: () => FindManyFilterQueryParams,
    description: 'List query filter options',
  })
  @IsOptional()
  @IsNestedObject(FindManyFilterQueryParams)
  readonly filter?: FindManyFilterQueryParams;

  @ApiPropertyOptional({
    type: () => [FindManySortQueryParams],
    description: 'List query sort options',
  })
  @IsOptional()
  @IsNestedArray(FindManySortQueryParams)
  readonly sort?: FindManySortQueryParams[];

  @ApiPropertyOptional({
    type: () => FindManyPaginationQueryParams,
    description: 'List query pagination options',
  })
  @IsOptional()
  @IsNestedObject(FindManyPaginationQueryParams)
  readonly pagination?: FindManyPaginationQueryParams;
}
