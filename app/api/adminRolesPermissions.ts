import type {
  AdminAccount,
  AdminPermission,
  ApiSuccessResponse,
} from '../types';
import { appAxios } from './axios';

export interface ListPermissionsQuery {
  page?: number;
  limit?: number;
}

export interface ListAdminsQuery {
  page?: number;
  limit?: number;
  role?: string;
  isActive?: boolean;
}

export const AdminRolesPermissionsApi = {
  listPermissions(params: ListPermissionsQuery) {
    return appAxios.get<ApiSuccessResponse<AdminPermission[]>>(
      '/admin/role-permission/permission',
      { params },
    );
  },

  createPermission(payload: Pick<AdminPermission, 'name' | 'description'>) {
    return appAxios.post<ApiSuccessResponse<AdminPermission>>(
      '/admin/role-permission/permission',
      payload,
    );
  },

  getPermission(id: string) {
    return appAxios.get<ApiSuccessResponse<AdminPermission>>(
      `/admin/role-permission/permission/${id}`,
    );
  },

  updatePermission(
    id: string,
    payload: Partial<Pick<AdminPermission, 'name' | 'description'>>,
  ) {
    return appAxios.put<ApiSuccessResponse<AdminPermission>>(
      `/admin/role-permission/permission/${id}`,
      payload,
    );
  },

  deletePermission(id: string) {
    return appAxios.delete<ApiSuccessResponse<unknown>>(
      `/admin/role-permission/permission/${id}`,
    );
  },

  listAdmins(params: ListAdminsQuery) {
    return appAxios.get<ApiSuccessResponse<AdminAccount[]>>(
      '/admin/role-permission/admin',
      { params },
    );
  },

  createAdmin(
    payload: Pick<
      AdminAccount,
      | 'firstName'
      | 'lastName'
      | 'email'
      | 'phoneNumber'
      | 'role'
      | 'permissions'
    > & { password: string },
  ) {
    return appAxios.post<ApiSuccessResponse<AdminAccount>>(
      '/admin/role-permission/admin',
      payload,
    );
  },

  getAdmin(id: string) {
    return appAxios.get<ApiSuccessResponse<AdminAccount>>(
      `/admin/role-permission/admin/details/${id}`,
    );
  },

  updateAdmin(
    id: string,
    payload: Partial<
      Pick<AdminAccount, 'firstName' | 'lastName' | 'phoneNumber'>
    >,
  ) {
    return appAxios.put<ApiSuccessResponse<AdminAccount>>(
      `/admin/role-permission/admin/${id}`,
      payload,
    );
  },

  updateAdminRole(id: string, role: AdminAccount['role']) {
    return appAxios.post<ApiSuccessResponse<AdminAccount>>(
      `/admin/role-permission/admin/update-role/${id}`,
      { role },
    );
  },

  updateAdminPermissions(id: string, permissions: string[]) {
    return appAxios.post<ApiSuccessResponse<AdminAccount>>(
      `/admin/role-permission/admin/update-permissions/${id}`,
      { permissions },
    );
  },

  activateAdmin(id: string) {
    return appAxios.post<ApiSuccessResponse<AdminAccount>>(
      `/admin/role-permission/admin/activate/${id}`,
    );
  },

  deactivateAdmin(id: string) {
    return appAxios.post<ApiSuccessResponse<AdminAccount>>(
      `/admin/role-permission/admin/deactivate/${id}`,
    );
  },
};
