import { FindManyFilterQueryParams } from 'src/common/dto';
import {
  QUERY_CUSTOM_FILTER_VALUE_KEYS,
  QUERY_ENUM_FILTER_VALUE_KEYS,
  QUERY_NUMBER_FILTER_VALUE_KEYS,
  QUERY_STRING_FILTER_VALUE_KEYS,
} from 'src/common/constants';
import { Prisma } from '@prisma/client';
import { Enum } from 'src/common/utils';

type FilterKeyTypeMapping<TEntity> = {
  [key in keyof TEntity]?: (v: string) => TEntity[key];
};

const translateKeyFilter = <TEntity, TPrismaFilter>(
  filter: FindManyFilterQueryParams | undefined,
  keyTypeMapping: FilterKeyTypeMapping<TEntity>,
): TPrismaFilter | undefined => {
  const filterPropertyKey = filter.key;
  const filterPropertyKeyType = keyTypeMapping[filterPropertyKey];

  if (!filterPropertyKeyType) {
    return undefined;
  }

  const initialFilterSettings: Record<string, unknown> = {};
  let filterKeys = [];

  switch (filterPropertyKeyType) {
    case Number: {
      filterKeys = QUERY_NUMBER_FILTER_VALUE_KEYS;
      break;
    }

    case String: {
      filterKeys = QUERY_STRING_FILTER_VALUE_KEYS;
      initialFilterSettings.mode = Prisma.QueryMode.insensitive;
      break;
    }

    case Enum: {
      filterKeys = QUERY_ENUM_FILTER_VALUE_KEYS;
      break;
    }

    default: {
      const filterKey = QUERY_CUSTOM_FILTER_VALUE_KEYS.find(key => filter[key]);
      return {
        [filterPropertyKey]: filterPropertyKeyType(filter[filterKey]),
      } as TPrismaFilter;
    }
  }

  return {
    [filterPropertyKey]: filterKeys.reduce((settings, filterKey) => {
      if (filter[filterKey]) {
        const comparatorValue = filter[filterKey];

        if (Array.isArray(comparatorValue)) {
          settings[filterKey] = comparatorValue.map(value => filterPropertyKeyType(value));
        } else {
          settings[filterKey] = filterPropertyKeyType(comparatorValue);
        }
      }

      return settings;
    }, initialFilterSettings),
  } as TPrismaFilter;
};

export const composePrismaFilter = <TEntity, TPrismaFilter>(
  filter: FindManyFilterQueryParams | undefined,
  keyTypeMapping: FilterKeyTypeMapping<TEntity>,
): TPrismaFilter | undefined => {
  if (!filter) {
    return undefined;
  }

  if (filter.key) {
    return translateKeyFilter(filter, keyTypeMapping);
  }

  if (filter.and) {
    return {
      AND: filter.and
        .map(filterSetting => composePrismaFilter(filterSetting, keyTypeMapping))
        .filter(Boolean),
    } as TPrismaFilter;
  }

  if (filter.or) {
    return {
      OR: filter.or
        .map(filterSetting => composePrismaFilter(filterSetting, keyTypeMapping))
        .filter(Boolean),
    } as TPrismaFilter;
  }

  if (filter.not) {
    return {
      NOT: filter.not
        .map(filterSetting => composePrismaFilter(filterSetting, keyTypeMapping))
        .filter(Boolean),
    } as TPrismaFilter;
  }
};
