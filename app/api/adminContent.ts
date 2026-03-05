import type {
  ApiSuccessResponse,
  FaqItem,
  SystemContentItem,
  TeamPermissionItem,
} from '../types';
import { appAxios } from './axios';

export interface ListFaqQuery {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export const AdminContentApi = {
  listFaq(params: ListFaqQuery) {
    return appAxios.get<ApiSuccessResponse<{ faqs: any }>>('/admin/faq', {
      params,
    });
  },

  createFaq(payload: Pick<FaqItem, 'question' | 'answer' | 'order'>) {
    return appAxios.post<ApiSuccessResponse<{ faq: FaqItem }>>(
      '/admin/faq',
      payload,
    );
  },

  updateFaq(
    id: string,
    payload: Partial<Pick<FaqItem, 'question' | 'answer' | 'order'>>,
  ) {
    return appAxios.put<ApiSuccessResponse<{ faq: FaqItem }>>(
      `/admin/faq/${id}`,
      payload,
    );
  },

  toggleFaqStatus(id: string, isActive: boolean) {
    return appAxios.patch<ApiSuccessResponse<{ faq: FaqItem }>>(
      `/admin/faq/${id}/status`,
      { isActive },
    );
  },

  deleteFaq(id: string) {
    return appAxios.delete<ApiSuccessResponse<unknown>>(`/admin/faq/${id}`);
  },

  getPrivacyPolicy() {
    return appAxios.get<ApiSuccessResponse<SystemContentItem>>(
      '/admin/data-management/privacy-policy',
    );
  },

  updatePrivacyPolicy(
    payload: Pick<SystemContentItem, 'title' | 'content' | 'version'>,
  ) {
    return appAxios.put<ApiSuccessResponse<SystemContentItem>>(
      '/admin/data-management/privacy-policy',
      payload,
    );
  },

  getTermsOfService() {
    return appAxios.get<ApiSuccessResponse<SystemContentItem>>(
      '/admin/data-management/terms-of-service',
    );
  },

  updateTermsOfService(
    payload: Pick<SystemContentItem, 'title' | 'content' | 'version'>,
  ) {
    return appAxios.put<ApiSuccessResponse<SystemContentItem>>(
      '/admin/data-management/terms-of-service',
      payload,
    );
  },

  getCommunityGuidelines() {
    return appAxios.get<ApiSuccessResponse<SystemContentItem>>(
      '/admin/data-management/community-guidelines',
    );
  },

  updateCommunityGuidelines(
    payload: Pick<SystemContentItem, 'title' | 'content' | 'version'>,
  ) {
    return appAxios.put<ApiSuccessResponse<SystemContentItem>>(
      '/admin/data-management/community-guidelines',
      payload,
    );
  },

  listTeamPermissions(params: { page?: number; limit?: number }) {
    return appAxios.get<ApiSuccessResponse<TeamPermissionItem[]>>(
      '/admin/data-management/team-permission',
      { params },
    );
  },

  createTeamPermission(
    payload: Pick<TeamPermissionItem, 'permission' | 'description'>,
  ) {
    return appAxios.post<ApiSuccessResponse<TeamPermissionItem>>(
      '/admin/data-management/team-permission',
      payload,
    );
  },

  getTeamPermission(id: string) {
    return appAxios.get<ApiSuccessResponse<TeamPermissionItem>>(
      `/admin/data-management/team-permission/details/${id}`,
    );
  },

  updateTeamPermission(
    id: string,
    payload: Partial<Pick<TeamPermissionItem, 'permission' | 'description'>>,
  ) {
    return appAxios.put<ApiSuccessResponse<TeamPermissionItem>>(
      `/admin/data-management/team-permission/${id}`,
      payload,
    );
  },

  deleteTeamPermission(id: string) {
    return appAxios.delete<ApiSuccessResponse<unknown>>(
      `/admin/data-management/team-permission/${id}`,
    );
  },
};
