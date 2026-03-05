import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';
import { RoutePaths } from './routes/route-paths';

export default [
  index('routes/home.tsx'),

  // Auth routes
  layout('layout/auth-layout/index.tsx', [
    route(RoutePaths.LOGIN, 'routes/auth/login.tsx'),
    route(RoutePaths.VERIFY_OTP, 'routes/auth/verify-otp.tsx'),
    route(RoutePaths.FORGOT_PASSWORD, 'routes/auth/forgot-password.tsx'),
    route(RoutePaths.RESET_PASSWORD, 'routes/auth/reset-password.tsx'),
  ]),

  // Dashboard routes
  layout('layout/dashboard-layout/index.tsx', [
    route(RoutePaths.DASHBOARD, 'routes/dashboard/index.tsx'),

    // Users
    route(RoutePaths.USERS, 'routes/users/index.tsx'),
    route(`${RoutePaths.USER_DETAILS}/:id`, 'routes/users/details.tsx'),

    // Testimonies
    route(RoutePaths.TESTIMONIES, 'routes/testimonies/index.tsx'),
    route(
      `${RoutePaths.TESTIMONY_DETAILS}/:id`,
      'routes/testimonies/details.tsx',
    ),
    route(RoutePaths.FLAGGED_TESTIMONIES, 'routes/testimonies/flagged.tsx'),
    route(RoutePaths.TESTIMONY_ANALYTICS, 'routes/testimonies/analytics.tsx'),

    // Subscriptions
    route(RoutePaths.SUBSCRIPTION_PLANS, 'routes/subscriptions/plans.tsx'),
    route(RoutePaths.SUBSCRIPTION_ACTIVE, 'routes/subscriptions/active.tsx'),
    route(
      RoutePaths.SUBSCRIPTION_CANCELLED,
      'routes/subscriptions/cancelled.tsx',
    ),
    route(
      RoutePaths.SUBSCRIPTION_UNSUBSCRIBED_USERS,
      'routes/subscriptions/unsubscribed-users.tsx',
    ),

    // Roles & permissions
    route(RoutePaths.PERMISSIONS, 'routes/roles-permissions/permissions.tsx'),
    route(RoutePaths.ADMINS, 'routes/roles-permissions/admins.tsx'),

    // Promotions
    route(RoutePaths.PROMOTIONS, 'routes/promotions/index.tsx'),
    route(RoutePaths.FLAGGED_PROMOTIONS, 'routes/promotions/flagged.tsx'),

    // Content / data management
    route(RoutePaths.FAQS, 'routes/content/faqs.tsx'),
    route(RoutePaths.PRIVACY_POLICY, 'routes/content/privacy-policy.tsx'),
    route(RoutePaths.TERMS_OF_SERVICE, 'routes/content/terms-of-service.tsx'),
    route(
      RoutePaths.COMMUNITY_GUIDELINES,
      'routes/content/community-guidelines.tsx',
    ),
    route(RoutePaths.TEAM_PERMISSIONS, 'routes/content/team-permissions.tsx'),

    // Audit logs
    route(RoutePaths.AUDIT_LOGS, 'routes/audit-logs/index.tsx'),
    route(
      `${RoutePaths.AUDIT_LOG_DETAILS}/:id`,
      'routes/audit-logs/details.tsx',
    ),

    // Settings
    route(RoutePaths.PROFILE_SETTINGS, 'routes/settings/profile.tsx'),
  ]),
] satisfies RouteConfig;
