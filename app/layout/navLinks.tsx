import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  TagIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import type React from 'react';
import { RoutePaths } from '../routes/route-paths';

export interface NavHiddenRoute {
  label: string;
  href: string;
}

export interface NavLinkItem {
  label: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  hiddenRoutes?: NavHiddenRoute[];
}

export interface NavGroupItem {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: NavLinkItem[];
  hiddenRoutes?: NavHiddenRoute[];
}

export interface NavSection {
  label?: string;
  items: Array<NavLinkItem | NavGroupItem>;
}

export function isNavGroupItem(
  item: NavLinkItem | NavGroupItem,
): item is NavGroupItem {
  return 'children' in item;
}

const pathMatches = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const getAllMatchableRoutes = (item: NavLinkItem | NavGroupItem) => {
  if (isNavGroupItem(item)) {
    return [
      ...(item.hiddenRoutes ?? []),
      ...item.children.flatMap((child) => [
        { label: child.label, href: child.href },
        ...(child.hiddenRoutes ?? []),
      ]),
    ];
  }

  return [{ label: item.label, href: item.href }, ...(item.hiddenRoutes ?? [])];
};

export const navigationSections: NavSection[] = [
  {
    items: [
      {
        label: 'Dashboard',
        href: RoutePaths.DASHBOARD,
        icon: Squares2X2Icon,
      },
      {
        label: 'Users',
        href: RoutePaths.USERS,
        icon: UsersIcon,
        hiddenRoutes: [
          {
            label: 'User details',
            href: RoutePaths.USER_DETAILS,
          },
        ],
      },
      {
        label: 'Testimonies',
        icon: ChatBubbleLeftRightIcon,
        children: [
          {
            label: 'All testimonies',
            href: RoutePaths.TESTIMONIES,
            hiddenRoutes: [
              {
                label: 'Testimony details',
                href: RoutePaths.TESTIMONY_DETAILS,
              },
            ],
          },
          {
            label: 'Analytics',
            href: RoutePaths.TESTIMONY_ANALYTICS,
          },
          {
            label: 'Flagged testimonies',
            href: RoutePaths.FLAGGED_TESTIMONIES,
          },
        ],
      },
      {
        label: 'Subscriptions',
        icon: CreditCardIcon,
        children: [
          {
            label: 'Plans',
            href: RoutePaths.SUBSCRIPTION_PLANS,
          },
          {
            label: 'Active subscriptions',
            href: RoutePaths.SUBSCRIPTION_ACTIVE,
          },
          {
            label: 'Cancelled subscriptions',
            href: RoutePaths.SUBSCRIPTION_CANCELLED,
          },
          {
            label: 'Unsubscribed users',
            href: RoutePaths.SUBSCRIPTION_UNSUBSCRIBED_USERS,
          },
        ],
      },
      {
        label: 'Promotions',
        icon: TagIcon,
        children: [
          {
            label: 'All promotions',
            href: RoutePaths.PROMOTIONS,
          },
          {
            label: 'Flagged promotions',
            href: RoutePaths.FLAGGED_PROMOTIONS,
          },
        ],
      },
    ],
  },
  {
    label: 'Content',
    items: [
      {
        label: 'Content',
        icon: DocumentTextIcon,
        children: [
          {
            label: 'FAQs',
            href: RoutePaths.FAQS,
          },
          {
            label: 'Privacy policy',
            href: RoutePaths.PRIVACY_POLICY,
          },
          {
            label: 'Terms of service',
            href: RoutePaths.TERMS_OF_SERVICE,
          },
          {
            label: 'Community guidelines',
            href: RoutePaths.COMMUNITY_GUIDELINES,
          },
          {
            label: 'Team permissions',
            href: RoutePaths.TEAM_PERMISSIONS,
          },
        ],
      },
    ],
  },
  {
    label: 'Administration',
    items: [
      {
        label: 'Roles & permissions',
        icon: ShieldCheckIcon,
        children: [
          {
            label: 'Admins',
            href: RoutePaths.ADMINS,
          },
          {
            label: 'Permissions',
            href: RoutePaths.PERMISSIONS,
          },
        ],
      },
      {
        label: 'Audit logs',
        href: RoutePaths.AUDIT_LOGS,
        icon: ClockIcon,
        hiddenRoutes: [
          {
            label: 'Audit log details',
            href: RoutePaths.AUDIT_LOG_DETAILS,
          },
        ],
      },
      {
        label: 'Settings',
        href: RoutePaths.PROFILE_SETTINGS,
        icon: Cog6ToothIcon,
      },
    ],
  },
];

export const getActiveGroupLabels = (pathname: string) =>
  navigationSections.flatMap((section) =>
    section.items
      .filter((item) => isNavGroupItem(item) && isNavItemActive(item, pathname))
      .map((item) => item.label),
  );

export function isNavItemActive(
  item: NavLinkItem | NavGroupItem,
  pathname: string,
) {
  return getAllMatchableRoutes(item).some((route) =>
    pathMatches(pathname, route.href),
  );
}

export function getCurrentRouteLabel(pathname: string) {
  const matches = navigationSections.flatMap((section) =>
    section.items.flatMap((item) =>
      getAllMatchableRoutes(item)
        .filter((route) => pathMatches(pathname, route.href))
        .map((route) => ({
          ...route,
          specificity: route.href.length,
        })),
    ),
  );

  return matches.sort((left, right) => right.specificity - left.specificity)[0]
    ?.label;
}
