export const RoutePaths = Object.freeze({
  HOME: "/",

  // Auth
  LOGIN: "/login",
  VERIFY_OTP: "/auth/verify-otp",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",

  // Dashboard
  DASHBOARD: "/dashboard",

  // Users
  USERS: "/users",
  USER_DETAILS: "/users/details",

  // Testimonies
  TESTIMONIES: "/testimonies",
  TESTIMONY_DETAILS: "/testimonies/details",
  FLAGGED_TESTIMONIES: "/testimonies/flagged",
  TESTIMONY_ANALYTICS: "/testimonies/analytics",

  // Subscriptions
  SUBSCRIPTION_PLANS: "/subscriptions/plans",
  SUBSCRIPTION_ACTIVE: "/subscriptions/active",
  SUBSCRIPTION_CANCELLED: "/subscriptions/cancelled",
  SUBSCRIPTION_UNSUBSCRIBED_USERS: "/subscriptions/unsubscribed-users",

  // Roles & Permissions
  PERMISSIONS: "/roles-permissions/permissions",
  ADMINS: "/roles-permissions/admins",

  // Promotions
  PROMOTIONS: "/promotions",
  FLAGGED_PROMOTIONS: "/promotions/flagged",

  // Data management
  FAQS: "/content/faqs",
  PRIVACY_POLICY: "/content/privacy-policy",
  TERMS_OF_SERVICE: "/content/terms-of-service",
  COMMUNITY_GUIDELINES: "/content/community-guidelines",
  TEAM_PERMISSIONS: "/content/team-permissions",

  // Audit logs
  AUDIT_LOGS: "/audit-logs",
  AUDIT_LOG_DETAILS: "/audit-logs/details",

  // Settings
  PROFILE_SETTINGS: "/settings/profile",
} as const);

export type RoutePathKey = keyof typeof RoutePaths;

