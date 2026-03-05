import type React from 'react';
import { RoutePaths } from '../routes/route-paths';
import {
  Squares2X2Icon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  TagIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ClockIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
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
  {
    label: 'Subscriptions',
    href: RoutePaths.SUBSCRIPTION_PLANS,
    icon: CreditCardIcon,
  },
  {
    label: 'Promotions',
    href: RoutePaths.PROMOTIONS,
    icon: TagIcon,
  },
];

export const secondaryLinks: NavItem[] = [
  {
    label: 'Roles & Permissions',
    href: RoutePaths.PERMISSIONS,
    icon: ShieldCheckIcon,
  },
  {
    label: 'Content',
    href: RoutePaths.FAQS,
    icon: DocumentTextIcon,
  },
  {
    label: 'Audit Logs',
    href: RoutePaths.AUDIT_LOGS,
    icon: ClockIcon,
  },
  {
    label: 'Settings',
    href: RoutePaths.PROFILE_SETTINGS,
    icon: Cog6ToothIcon,
  },
];
