import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import {
  QUERY_FILTER_DEFINITION_KEYS,
  QueryFilterKey,
  QUERY_FILTER_VALUE_KEYS,
} from 'src/common/constants';
import { FindManyFilterQueryParams } from 'src/common/dto';

@Injectable()
export class ListQueryFilterGuard<TDto> implements CanActivate {
  constructor(private options: { entityName: string; filterKeys: Array<keyof TDto> }) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const filter = request.query.filter;

    if (!filter) {
      return true;
    }

    return this.validateFilterTree(filter);
  }

  validateFilterTree(filter: FindManyFilterQueryParams): boolean {
    this.validateFilter(filter);

    if (filter.and && Array.isArray(filter.and)) {
      filter.and.forEach(f => this.validateFilterTree(f));
    }

    if (filter.or && Array.isArray(filter.or)) {
      filter.or.forEach(f => this.validateFilterTree(f));
    }

    if (filter.not && Array.isArray(filter.not)) {
      filter.not.forEach(f => this.validateFilterTree(f));
    }

    return true;
  }

  validateFilter(filter: FindManyFilterQueryParams) {
    const filterObjectKeys = Object.keys(filter);
    const filterDefinitionKeys = filterObjectKeys.filter(key =>
      QUERY_FILTER_DEFINITION_KEYS.includes(key as QueryFilterKey),
    );
    const filterValueKeys = filterObjectKeys.filter(key =>
      QUERY_FILTER_VALUE_KEYS.includes(key as QueryFilterKey),
    );

    const hasDefinitionKeys = filterDefinitionKeys.length > 0;
    const hasMultipleDefinitionKeys = filterDefinitionKeys.length > 1;
    const hasFilteredPropertyKey = filterDefinitionKeys.includes(QueryFilterKey.Key);

    const hasValueKeys = filterValueKeys.length > 0;
    const hasMultipleValueKeys = filterValueKeys.length > 1;

    if (
      hasFilteredPropertyKey &&
      !this.options.filterKeys.includes(filter[QueryFilterKey.Key] as keyof TDto)
    ) {
      throw new BadRequestException(
        this.invalidFilterErrorMessage(
          // eslint-disable-next-line max-len
          `The key '${filter[QueryFilterKey.Key]}' passed to the filter is not defined in the ${this.options.entityName}`,
        ),
      );
    }

    if (hasMultipleDefinitionKeys) {
      throw new BadRequestException(
        this.invalidFilterErrorMessage(
          // eslint-disable-next-line max-len
          `Expected 1 definition key, ${filterDefinitionKeys.length} received: ${filterDefinitionKeys}`,
        ),
      );
    }

    if (hasMultipleValueKeys) {
      throw new BadRequestException(
        this.invalidFilterErrorMessage(
          // eslint-disable-next-line max-len
          `Expected 1 value key, ${filterValueKeys.length} received: ${filterValueKeys}`,
        ),
      );
    }

    if ((!hasFilteredPropertyKey && hasValueKeys) || (hasFilteredPropertyKey && !hasValueKeys)) {
      throw new BadRequestException(
        this.invalidFilterErrorMessage('Either definition or value key is missing'),
      );
    }

    if (!hasDefinitionKeys && !hasValueKeys) {
      throw new BadRequestException(
        this.invalidFilterErrorMessage('None of definition or value keys were found'),
      );
    }
  }

  invalidFilterErrorMessage(message: string) {
    return `Malformed 'filter': ${message}`;
  }
}
