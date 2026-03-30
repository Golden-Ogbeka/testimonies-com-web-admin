import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  UserCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import type React from 'react';
import { RoutePaths } from '../routes/route-paths';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const mainLinks: NavItem[] = [
  {
    label: 'Dashboard',
    href: RoutePaths.DASHBOARD,
    icon: Squares2X2Icon,
  },
  {
    label: 'Users',
    href: RoutePaths.USERS,
    icon: UsersIcon,
  },
  {
    label: 'Testimonies',
    href: RoutePaths.TESTIMONIES,
    icon: ChatBubbleLeftRightIcon,
  },
  // {
  //   label: 'Subscriptions',
  //   href: RoutePaths.SUBSCRIPTION_PLANS,
  //   icon: CreditCardIcon,
  // },
  // {
  //   label: 'Promotions',
  //   href: RoutePaths.PROMOTIONS,
  //   icon: TagIcon,
  // },
];

export const contentLinks: NavItem[] = [
  {
    label: 'FAQs',
    href: RoutePaths.FAQS,
    icon: QuestionMarkCircleIcon,
  },
  {
    label: 'Privacy Policy',
    href: RoutePaths.PRIVACY_POLICY,
    icon: ShieldCheckIcon,
  },
  {
    label: 'Terms of Service',
    href: RoutePaths.TERMS_OF_SERVICE,
    icon: DocumentTextIcon,
  },
  {
    label: 'Community Guidelines',
    href: RoutePaths.COMMUNITY_GUIDELINES,
    icon: ExclamationTriangleIcon,
  },
];

export const secondaryLinks: NavItem[] = [
  {
    label: 'Audit Logs',
    href: RoutePaths.AUDIT_LOGS,
    icon: ClockIcon,
  },
  {
    label: 'Admins',
    href: RoutePaths.ADMINS,
    icon: UserCircleIcon,
  },
  // {
  //   label: 'Roles & Permissions',
  //   href: RoutePaths.PERMISSIONS,
  //   icon: ShieldCheckIcon,
  // },
  // {
  //   label: 'Team Permissions',
  //   href: RoutePaths.TEAM_PERMISSIONS,
  //   icon: UserGroupIcon,
  // },

  {
    label: 'Settings',
    href: RoutePaths.PROFILE_SETTINGS,
    icon: Cog6ToothIcon,
  },
];
