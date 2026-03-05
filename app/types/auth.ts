export type AdminRole = 'admin' | 'super-admin';

export interface AdminProfile {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: AdminRole;
  permissions: string[];
  active: boolean;
  emailIsVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminToken {
  token: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminVerifyOtpRequest {
  email: string;
  otp: string;
}
