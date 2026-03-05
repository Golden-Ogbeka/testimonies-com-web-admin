import { appAxios } from './axios';
import type {
  AdminUserSummary,
  AdminUserStats,
  ApiSuccessResponse,
  PaginationMeta,
} from '../types';

export interface ListUsersQuery {
  page?: number;
  limit?: number;
  isActive?: boolean;
  isFlagged?: boolean;
  accountType?: string;
  subscriptionType?: string;
}

export interface ListUsersResponse {
  users: AdminUserSummary[];
  meta: PaginationMeta;
}

export const AdminUsersApi = {
  list(params: ListUsersQuery) {
    return appAxios.get<ApiSuccessResponse<AdminUserSummary[]>>('/admin/user', {
      params,
    });
  },

  getById(id: string) {
    return appAxios.get<ApiSuccessResponse<AdminUserSummary>>(
      `/admin/user/details/${id}`,
    );
  },

  update(
    id: string,
    payload: Partial<Pick<AdminUserSummary, 'isFlagged' | 'active'>>,
  ) {
    return appAxios.patch<ApiSuccessResponse<AdminUserSummary>>(
      `/admin/user/${id}`,
      payload,
    );
  },

  deactivate(id: string) {
    return appAxios.post<ApiSuccessResponse<unknown>>(
      `/admin/user/deactivate/${id}`,
    );
  },

  activate(id: string) {
    return appAxios.post<ApiSuccessResponse<unknown>>(
      `/admin/user/activate/${id}`,
    );
  },

  statsAll() {
    return appAxios.get<ApiSuccessResponse<AdminUserStats>>(
      '/admin/user/stats/all',
    );
  },

  statsByUser(id: string) {
    return appAxios.get<ApiSuccessResponse<AdminUserStats>>(
      `/admin/user/${id}/stats`,
    );
  },
};
