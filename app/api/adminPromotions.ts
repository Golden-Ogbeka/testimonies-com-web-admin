import type {
    ApiSuccessResponse,
    PromotionSummary,
    PromotionTargetAudience,
    PromotionType
} from "../types";
import { appAxios } from "./axios";

export interface ListPromotionsQuery {
  page?: number;
  limit?: number;
  type?: PromotionType;
  targetAudience?: PromotionTargetAudience;
  isActive?: boolean;
  isFlagged?: boolean;
}

export const AdminPromotionsApi = {
  list(params: ListPromotionsQuery) {
    return appAxios.get<ApiSuccessResponse<PromotionSummary[]>>("/admin/promotion", {
      params,
    });
  },

  create(payload: Omit<PromotionSummary, "_id" | "createdAt" | "updatedAt" | "isFlagged">) {
    return appAxios.post<ApiSuccessResponse<PromotionSummary>>(
      "/admin/promotion",
      payload,
    );
  },

  getById(id: string) {
    return appAxios.get<ApiSuccessResponse<PromotionSummary>>(
      `/admin/promotion/details/${id}`,
    );
  },

  update(id: string, payload: Partial<PromotionSummary>) {
    return appAxios.put<ApiSuccessResponse<PromotionSummary>>(
      `/admin/promotion/${id}`,
      payload,
    );
  },

  activate(id: string) {
    return appAxios.post<ApiSuccessResponse<PromotionSummary>>(
      `/admin/promotion/activate/${id}`,
    );
  },

  deactivate(id: string) {
    return appAxios.post<ApiSuccessResponse<PromotionSummary>>(
      `/admin/promotion/deactivate/${id}`,
    );
  },

  flag(id: string, reason: string) {
    return appAxios.post<ApiSuccessResponse<PromotionSummary>>(
      `/admin/promotion/flag/${id}`,
      { reason },
    );
  },

  unflag(id: string, reason?: string) {
    return appAxios.post<ApiSuccessResponse<PromotionSummary>>(
      `/admin/promotion/unflag/${id}`,
      { reason },
    );
  },

  listFlagged(params: { page?: number; limit?: number }) {
    return appAxios.get<ApiSuccessResponse<PromotionSummary[]>>(
      "/admin/promotion/flagged",
      { params },
    );
  },
};

