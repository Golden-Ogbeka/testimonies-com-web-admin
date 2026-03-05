import type { AuditLogLevel, AuditLogCategory } from './enums';

export interface AdminUserSummary {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  profileImage?: string;
  active: boolean;
  isFlagged: boolean;
  accountType: string;
  subscriptionType?: string;
  createdAt: string;
}

export interface AdminUserStats {
  totalUsers: number;
  activeUsers: number;
  flaggedUsers: number;
  verifiedUsers: number;
}

export interface AdminTestimonySummary {
  _id: string;
  userId: string;
  content: string;
  isFlagged: boolean;
  createdAt: string;
}

export interface AdminTestimonyAnalyticsItem {
  testimonyId: string;
  title?: string;
  userId: string;
  count: number;
}

export type SubscriptionBillingCycle = 'monthly' | 'yearly' | 'quarterly';

export interface SubscriptionPlan {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: SubscriptionBillingCycle;
  features: string[];
  trialDays?: number;
  maxUsers?: number;
  maxTestimonies?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trial';

export interface SubscriptionSummary {
  _id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  userType: 'user' | 'organization';
}

export type AdminRole = 'super-admin' | 'admin';

export interface AdminPermission {
  _id: string;
  name: string;
  description: string;
}

export interface AdminAccount {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: AdminRole;
  permissions: string[];
  active: boolean;
  emailIsVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PromotionType = 'discount' | 'offer' | 'announcement' | 'feature';

export type PromotionTargetAudience =
  | 'all'
  | 'premium'
  | 'basic'
  | 'organizations';

export interface PromotionSummary {
  _id: string;
  title: string;
  description: string;
  type: PromotionType;
  targetAudience: PromotionTargetAudience;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  isFlagged: boolean;
  flagReason?: string;
}

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SystemContentType =
  | 'privacy_policy'
  | 'terms_of_service'
  | 'community_guidelines';

export interface SystemContentItem {
  _id: string;
  type: SystemContentType;
  title: string;
  content: string;
  version?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamPermissionItem {
  _id: string;
  permission: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogItem {
  _id: string;
  adminId?: string;
  userId?: string;
  action: string;
  userType?: 'admin' | 'user' | 'organization';
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  level: AuditLogLevel;
  category: AuditLogCategory;
  createdAt: string;
  updatedAt: string;
}
