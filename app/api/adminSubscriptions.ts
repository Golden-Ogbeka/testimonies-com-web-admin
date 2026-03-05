import type {
  ApiSuccessResponse,
  PaginationMeta,
  SubscriptionPlan,
  SubscriptionSummary,
} from '../types';
import { appAxios } from './axios';

export interface ListPlansQuery {
  page?: number;
  limit?: number;
  isActive?: boolean;
  billingCycle?: string;
}

export interface ListPlansResponse {
  plans: SubscriptionPlan[];
  meta: PaginationMeta;
}

export const AdminSubscriptionsApi = {
  listPlans(params: ListPlansQuery) {
    return appAxios.get<ApiSuccessResponse<SubscriptionPlan[]>>(
      '/admin/subscription',
      { params },
    );
  },

  createPlan(
    payload: Omit<
      SubscriptionPlan,
      '_id' | 'createdAt' | 'updatedAt' | 'isActive'
    >,
  ) {
    return appAxios.post<ApiSuccessResponse<SubscriptionPlan>>(
      '/admin/subscription',
      payload,
    );
  },

  getPlan(id: string) {
    return appAxios.get<ApiSuccessResponse<SubscriptionPlan>>(
      `/admin/subscription/details/${id}`,
    );
  },

  updatePlan(id: string, payload: Partial<SubscriptionPlan>) {
    return appAxios.put<ApiSuccessResponse<SubscriptionPlan>>(
      `/admin/subscription/${id}`,
      payload,
    );
  },

  deletePlan(id: string) {
    return appAxios.delete<ApiSuccessResponse<unknown>>(
      `/admin/subscription/${id}`,
    );
  },

  activatePlan(id: string) {
    return appAxios.post<ApiSuccessResponse<unknown>>(
      `/admin/subscription/activate/${id}`,
    );
  },

  deactivatePlan(id: string) {
    return appAxios.post<ApiSuccessResponse<unknown>>(
      `/admin/subscription/deactivate/${id}`,
    );
  },

  planSubscribers(id: string, params: { page?: number; limit?: number }) {
    return appAxios.get<ApiSuccessResponse<SubscriptionSummary[]>>(
      `/admin/subscription/subscribed-users/${id}`,
      { params },
    );
  },

  planStatistics(id: string) {
    return appAxios.get<ApiSuccessResponse<unknown>>(
      `/admin/subscription/statistics/${id}`,
    );
  },

  extendSubscription(subscriptionId: string, days: number) {
    return appAxios.post<ApiSuccessResponse<unknown>>(
      `/admin/subscription/extend-subscription/${subscriptionId}`,
      { days },
    );
  },

  userSubscription(userId: string) {
    return appAxios.get<ApiSuccessResponse<SubscriptionSummary>>(
      `/admin/subscription/user-subscription/${userId}`,
    );
  },

  listActive(params: { page?: number; limit?: number }) {
    return appAxios.get<ApiSuccessResponse<SubscriptionSummary[]>>(
      '/admin/subscription/active-subscriptions',
      { params },
    );
  },

  listCancelled(params: { page?: number; limit?: number }) {
    return appAxios.get<ApiSuccessResponse<SubscriptionSummary[]>>(
      '/admin/subscription/cancelled-subscriptions',
      { params },
    );
  },

  listUnsubscribedUsers(params: { page?: number; limit?: number }) {
    return appAxios.get<ApiSuccessResponse<SubscriptionSummary[]>>(
      '/admin/subscription/unsubscribed-users',
      { params },
    );
  },
};
