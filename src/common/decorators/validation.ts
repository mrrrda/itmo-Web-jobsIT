import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsObject, Min, ValidateNested } from 'class-validator';

export const IsNestedObject = (type: Function) =>
  applyDecorators(
    IsObject(),
    Type(() => type),
    ValidateNested(),
  );

export const IsNestedArray = (type: Function) =>
  applyDecorators(
    IsArray(),
    Type(() => type),
    ValidateNested({ each: true }),
  );

export const IsNonNegativeInt = () => applyDecorators(IsInt(), Min(0));
