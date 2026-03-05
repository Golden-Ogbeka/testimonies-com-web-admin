export interface PaginationMeta {
  totalResults: number;
  resultsPerPage: number;
  totalPages: number;
  currentPage: number;
  prevPage: number | null;
  nextPage: number | null;
}

export interface ApiSuccessResponse<T> {
  message: string;
  data: T;
  requestId?: string;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  requestId?: string;
}
