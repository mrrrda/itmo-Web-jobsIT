export enum QueryFilterKey {
  Key = 'key',
  And = 'and',
  Or = 'or',
  Not = 'not',

  Equals = 'equals',
  In = 'in',
  NotIn = 'notIn',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  Contains = 'contains',
}

export const QUERY_FILTER_DEFINITION_KEYS = [
  QueryFilterKey.Key,
  QueryFilterKey.And,
  QueryFilterKey.Or,
  QueryFilterKey.Not,
];

export const QUERY_FILTER_VALUE_KEYS = [
  QueryFilterKey.Equals,
  QueryFilterKey.In,
  QueryFilterKey.NotIn,
  QueryFilterKey.GT,
  QueryFilterKey.GTE,
  QueryFilterKey.LT,
  QueryFilterKey.LTE,
  QueryFilterKey.Contains,
];

export const QUERY_STRING_FILTER_VALUE_KEYS = QUERY_FILTER_VALUE_KEYS;

export const QUERY_ENUM_FILTER_VALUE_KEYS = [
  QueryFilterKey.Equals,
  QueryFilterKey.In,
  QueryFilterKey.NotIn,
];

export const QUERY_NUMBER_FILTER_VALUE_KEYS = QUERY_FILTER_VALUE_KEYS.filter(
  key => ![QueryFilterKey.Contains].includes(key),
);

export const QUERY_CUSTOM_FILTER_VALUE_KEYS = [QueryFilterKey.Equals, QueryFilterKey.Contains];
