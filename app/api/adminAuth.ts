import { appAxios } from './axios';
import type {
  AdminLoginRequest,
  AdminProfile,
  AdminVerifyOtpRequest,
} from '../types/auth';
import type { ApiSuccessResponse } from '../types/api';

interface LoginResponseData {
  adminId: string;
  email: string;
}

interface VerifyOtpResponseData {
  token: string;
  admin: AdminProfile;
}

export const AdminAuthApi = {
  login(payload: AdminLoginRequest) {
    return appAxios.post<ApiSuccessResponse<LoginResponseData>>(
      '/admin/auth/login',
      payload,
    );
  },

  verifyOtp(payload: AdminVerifyOtpRequest) {
    return appAxios.post<ApiSuccessResponse<VerifyOtpResponseData>>(
      '/admin/auth/verify-otp',
      payload,
    );
  },

  resendOtp(email: string) {
    return appAxios.post<ApiSuccessResponse<unknown>>(
      '/admin/auth/resend-otp',
      {
        email,
      },
    );
  },

  requestPasswordReset(email: string) {
    return appAxios.post<ApiSuccessResponse<unknown>>(
      '/admin/auth/reset-password',
      {
        email,
      },
    );
  },

  resetPassword(payload: { email: string; otp: string; newPassword: string }) {
    return appAxios.post<ApiSuccessResponse<unknown>>(
      '/admin/auth/reset-password/update',
      payload,
    );
  },

  changePassword(payload: { currentPassword: string; newPassword: string }) {
    return appAxios.post<ApiSuccessResponse<unknown>>(
      '/admin/auth/change-password',
      payload,
    );
  },

  getProfile() {
    return appAxios.get<ApiSuccessResponse<{ admin: AdminProfile }>>(
      '/admin/auth/profile',
    );
  },

  updateProfile(
    payload: Partial<
      Pick<AdminProfile, 'firstName' | 'lastName' | 'phoneNumber'>
    >,
  ) {
    return appAxios.put<ApiSuccessResponse<{ admin: AdminProfile }>>(
      '/admin/auth/profile',
      payload,
    );
  },

  logout() {
    return appAxios.post<ApiSuccessResponse<unknown>>('/admin/auth/logout');
  },
};
