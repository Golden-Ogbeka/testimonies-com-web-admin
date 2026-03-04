import { appAxios } from "./axios";
import type { ApiSuccessResponse, AuditLogItem } from "../types";

export interface ListAuditLogsQuery {
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  startDate?: string;
  endDate?: string;
}

export const AdminAuditLogsApi = {
  list(params: ListAuditLogsQuery) {
    return appAxios.get<ApiSuccessResponse<{ auditLogs: { docs: AuditLogItem[] } }>>(
      "/admin/audit-log",
      { params },
    );
  },

  getById(id: string) {
    return appAxios.get<ApiSuccessResponse<{ auditLog: AuditLogItem }>>(
      `/admin/audit-log/details/${id}`,
    );
  },

  listByAdmin(adminId: string, params: { page?: number; limit?: number }) {
    return appAxios.get<ApiSuccessResponse<{ auditLogs: { docs: AuditLogItem[] } }>>(
      `/admin/audit-log/admin-logs/${adminId}`,
      { params },
    );
  },
};

