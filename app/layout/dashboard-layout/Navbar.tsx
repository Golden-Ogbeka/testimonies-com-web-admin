import autoAnimate from '@formkit/auto-animate';
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AdminAuthApi } from '../../api/adminAuth';
import { RoutePaths } from '../../routes/route-paths';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signOut } from '../../store/slices/admin';
import {
  getActiveGroupLabels,
  getCurrentRouteLabel,
  isNavGroupItem,
  isNavItemActive,
  navigationSections,
  type NavGroupItem,
  type NavLinkItem,
} from '../navLinks';

interface NavbarProps {
  onMenuClick?: () => void;
  ariaExpanded?: boolean;
}

const Navbar = ({ onMenuClick, ariaExpanded = false }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.admin);
  const location = useLocation();
  const navigate = useNavigate();
  const parentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const activeGroups = getActiveGroupLabels(location.pathname);
    if (activeGroups.length === 0) return;

    setExpandedGroups((previous) => {
      const nextState = { ...previous };
      activeGroups.forEach((label) => {
        nextState[label] = true;
      });
      return nextState;
    });
  }, [location.pathname]);

  const requestClose = () => {
    if (!open || isClosing) return;
    setIsClosing(true);
  };

  const handleDropdownAnimationEnd = () => {
    if (isClosing) {
      setOpen(false);
      setIsClosing(false);
    }
  };

  useEffect(() => {
    if (parentRef.current) {
      autoAnimate(parentRef.current);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        parentRef.current &&
        !parentRef.current.contains(event.target as Node)
      ) {
        requestClose();
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [open, isClosing]);

  const initials =
    profile != null
      ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
      : '';

  const handleLogout = async () => {
    try {
      await AdminAuthApi.logout();
    } catch {
      // Best-effort: even if the API fails, clear local session.
    } finally {
      dispatch(signOut());
      setLogoutConfirmOpen(false);
      navigate(RoutePaths.LOGIN);
    }
  };

  const toggleGroup = (group: NavGroupItem) => {
    setExpandedGroups((previous) => ({
      ...previous,
      [group.label]: !previous[group.label],
    }));
  };

  const renderLeafLink = (item: NavLinkItem, isChild: boolean = false) => {
    const isActive = isNavItemActive(item, location.pathname);
    return (
      <Link
        key={item.href}
        to={item.href}
        role="menuitem"
        onClick={requestClose}
        className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-primary text-white hover:bg-primary/90 [&_svg]:text-white'
            : 'text-slate-700 hover:bg-slate-50'
        } ${isChild ? 'ml-3' : ''}`}
      >
        {item.icon ? (
          <item.icon className="h-4 w-4 shrink-0" aria-hidden />
        ) : (
          <span
            aria-hidden
            className="h-2 w-2 shrink-0 rounded-full bg-current opacity-60"
          />
        )}
        {item.label}
      </Link>
    );
  };

  const renderGroup = (group: NavGroupItem) => {
    const isActive = isNavItemActive(group, location.pathname);
    const isExpanded = Boolean(expandedGroups[group.label]);

    return (
      <div key={group.label} className="py-1">
        <button
          type="button"
          role="menuitem"
          onClick={() => toggleGroup(group)}
          className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-slate-700 hover:bg-slate-50'
          }`}
          aria-expanded={isExpanded}
        >
          <group.icon className="h-4 w-4 shrink-0" aria-hidden />
          <span className="flex-1 text-left">{group.label}</span>
          <ChevronDownIcon
            className={`h-4 w-4 shrink-0 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
        {isExpanded && (
          <div className="mt-1 space-y-1">
            {group.children.map((child) => renderLeafLink(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-sm rounded-lg bg-white p-6">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Log out?
            </h3>
            <p className="mb-6 text-sm text-slate-600">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setLogoutConfirmOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              {onMenuClick && (
                <button
                  type="button"
                  onClick={onMenuClick}
                  className="p-2 text-slate-600 lg:hidden"
                  aria-label="Open menu"
                  aria-expanded={ariaExpanded}
                >
                  <Bars3Icon className="h-6 w-6" aria-hidden />
                </button>
              )}
              <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex">
                <Link
                  to={RoutePaths.DASHBOARD}
                  className="flex shrink-0 items-center gap-2 rounded-lg transition-opacity hover:opacity-90"
                  aria-label="Go to overview"
                >
                  <span className="truncate text-xl font-bold tracking-tight text-slate-900">
                    Testimonies Admin
                  </span>
                </Link>
                <span className="shrink-0 text-slate-400" aria-hidden>
                  ·
                </span>
                <span className="truncate text-sm font-bold text-slate-900">
                  {getCurrentRouteLabel(location.pathname) ?? 'Dashboard'}
                </span>
              </div>
            </div>
            <div
              className="relative flex items-center gap-2 sm:gap-4"
              ref={parentRef}
            >
              {profile && (
                <button
                  type="button"
                  onClick={() => (open ? requestClose() : setOpen(true))}
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary/10 text-sm font-bold text-primary hover:ring-2 hover:ring-primary/30"
                  aria-label="User menu"
                  aria-expanded={open}
                  aria-haspopup="true"
                >
                  {initials}
                </button>
              )}
              {(open || isClosing) && profile && (
                <div
                  className={`absolute right-0 top-full z-50 mt-2 max-h-[75vh] w-72 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg ${
                    isClosing
                      ? 'animate-dropdown-close'
                      : 'animate-dropdown-open'
                  }`}
                  role="menu"
                  onAnimationEnd={handleDropdownAnimationEnd}
                >
                  {navigationSections.map((section) => (
                    <div key={section.label ?? 'main'} className="py-1">
                      {section.label && (
                        <p className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          {section.label}
                        </p>
                      )}
                      <div className="space-y-1 px-2">
                        {section.items.map((item) =>
                          isNavGroupItem(item)
                            ? renderGroup(item)
                            : renderLeafLink(item),
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-slate-200" />
                  <div className="py-1">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        requestClose();
                        setLogoutConfirmOpen(true);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <ArrowRightOnRectangleIcon
                        className="h-4 w-4 shrink-0 text-red-600"
                        aria-hidden
                      />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
