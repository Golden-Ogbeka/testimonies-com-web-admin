import type {
  AdminTestimonyAnalyticsItem,
  AdminTestimonySummary,
  ApiSuccessResponse,
} from '../types';
import { appAxios } from './axios';

export interface ListTestimoniesQuery {
  page?: number;
  limit?: number;
  isFlagged?: boolean;
  userId?: string;
}

export const AdminTestimoniesApi = {
  list(params: ListTestimoniesQuery) {
    return appAxios.get<ApiSuccessResponse<AdminTestimonySummary[]>>(
      '/admin/testimony',
      {
        params,
      },
    );
  },

  getById(id: string) {
    return appAxios.get<ApiSuccessResponse<AdminTestimonySummary>>(
      `/admin/testimony/details/${id}`,
    );
  },

  flag(id: string, reason: string) {
    return appAxios.post<ApiSuccessResponse<unknown>>(
      `/admin/testimony/flag/${id}`,
      {
        reason,
      },
    );
  },

  unflag(id: string, reason?: string) {
    return appAxios.post<ApiSuccessResponse<unknown>>(
      `/admin/testimony/unflag/${id}`,
      {
        reason,
      },
    );
  },

  listFlagged(params: { page?: number; limit?: number }) {
    return appAxios.get<ApiSuccessResponse<AdminTestimonySummary[]>>(
      '/admin/testimony/flagged',
      { params },
    );
  },

  analyticsHighestEngagement(limit?: number) {
    return appAxios.get<ApiSuccessResponse<AdminTestimonyAnalyticsItem[]>>(
      '/admin/testimony/highest-engagement',
      { params: { limit } },
    );
  },
  analyticsHighestLikes(limit?: number) {
    return appAxios.get<ApiSuccessResponse<AdminTestimonyAnalyticsItem[]>>(
      '/admin/testimony/highest-likes',
      { params: { limit } },
    );
  },
  analyticsHighestReplies(limit?: number) {
    return appAxios.get<ApiSuccessResponse<AdminTestimonyAnalyticsItem[]>>(
      '/admin/testimony/highest-replies',
      { params: { limit } },
    );
  },
  analyticsHighestViews(limit?: number) {
    return appAxios.get<ApiSuccessResponse<AdminTestimonyAnalyticsItem[]>>(
      '/admin/testimony/highest-views',
      { params: { limit } },
    );
  },
  analyticsMostActiveUsers(limit?: number) {
    return appAxios.get<ApiSuccessResponse<AdminTestimonyAnalyticsItem[]>>(
      '/admin/testimony/most-active-users',
      { params: { limit } },
    );
  },
  analyticsMostEngagedUsers(limit?: number) {
    return appAxios.get<ApiSuccessResponse<AdminTestimonyAnalyticsItem[]>>(
      '/admin/testimony/most-engaged-users',
      { params: { limit } },
    );
  },
};
