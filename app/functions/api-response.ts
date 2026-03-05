import type { ApiSuccessResponse, PaginationMeta } from '../types';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizePagination = (value: unknown): PaginationMeta => {
  const record = isRecord(value) ? value : {};

  if ('totalDocs' in record) {
    return {
      totalResults: toNumber(record.totalDocs),
      resultsPerPage: toNumber(record.limit),
      totalPages: toNumber(record.totalPages, 1),
      currentPage: toNumber(record.page, 1),
      prevPage: (record.prevPage as number | null) ?? null,
      nextPage: (record.nextPage as number | null) ?? null,
    };
  }

  return {
    totalResults: toNumber(record.totalResults),
    resultsPerPage: toNumber(record.resultsPerPage),
    totalPages: toNumber(record.totalPages, 1),
    currentPage: toNumber(record.currentPage, 1),
    prevPage: (record.prevPage as number | null) ?? null,
    nextPage: (record.nextPage as number | null) ?? null,
  };
};

const findPaginatedObject = (value: unknown): UnknownRecord | null => {
  if (!isRecord(value)) return null;
  if (Array.isArray(value.results) || Array.isArray(value.docs)) return value;

  for (const nested of Object.values(value)) {
    if (
      isRecord(nested) &&
      (Array.isArray(nested.results) || Array.isArray(nested.docs))
    ) {
      return nested;
    }
  }
  return null;
};

const getKey = <T>(value: unknown, key: string): T | null => {
  if (!isRecord(value)) return null;
  const nested = value[key];
  return nested === undefined ? null : (nested as T);
};

export const getResponseData = <T>(payload: ApiSuccessResponse<unknown>): T =>
  payload.data as T;

export const getResponseResource = <T>(
  payload: ApiSuccessResponse<unknown>,
  key: string,
): T => {
  const dataRecord = isRecord(payload.data) ? payload.data : {};
  const direct = getKey<T>(dataRecord, key);
  if (direct !== null) return direct;

  const topLevel = getKey<T>(payload as unknown as UnknownRecord, key);
  if (topLevel !== null) return topLevel;

  return payload.data as T;
};

export const getPaginatedResponse = <T>(
  payload: ApiSuccessResponse<unknown>,
  key?: string,
): { results: T[]; pagination: PaginationMeta } => {
  const source = key
    ? getResponseResource<unknown>(payload, key)
    : payload.data;
  const paginated = findPaginatedObject(source);

  if (!paginated) {
    if (Array.isArray(source)) {
      const size = source.length;
      return {
        results: source as T[],
        pagination: {
          totalResults: size,
          resultsPerPage: size,
          totalPages: 1,
          currentPage: 1,
          prevPage: null,
          nextPage: null,
        },
      };
    }

    return {
      results: [],
      pagination: {
        totalResults: 0,
        resultsPerPage: 0,
        totalPages: 1,
        currentPage: 1,
        prevPage: null,
        nextPage: null,
      },
    };
  }

  const rawResults = Array.isArray(paginated.results)
    ? paginated.results
    : Array.isArray(paginated.docs)
      ? paginated.docs
      : [];

  const pagination = normalizePagination(
    paginated.pagination ?? paginated.meta ?? paginated,
  );

  return { results: rawResults as T[], pagination };
};
