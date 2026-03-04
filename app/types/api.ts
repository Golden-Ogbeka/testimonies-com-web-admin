export interface PaginationMeta {
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface ApiSuccessResponse<T> {
  message: string;
  data: T;
  requestId: string;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  requestId?: string;
}

