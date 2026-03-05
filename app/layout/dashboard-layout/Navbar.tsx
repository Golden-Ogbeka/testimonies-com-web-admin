import autoAnimate from '@formkit/auto-animate';
import { useEffect, useRef, useState } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import { Link, useLocation } from 'react-router';
import { RoutePaths } from '../../routes/route-paths';
import { useAppSelector } from '../../store/hooks';
import {
  Bars3Icon,
  ArrowRightOnRectangleIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { mainLinks, secondaryLinks } from '../navLinks';

interface NavbarProps {
  onMenuClick?: () => void;
  ariaExpanded?: boolean;
}

const Navbar = ({ onMenuClick, ariaExpanded = false }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const { profile } = useAppSelector((state) => state.admin);
  const location = useLocation();
  const parentRef = useRef<HTMLDivElement | null>(null);

  const allLinks = [...mainLinks, ...secondaryLinks];

  const getRouteName = () => {
    const currentPath = location.pathname;
    const mainLink = mainLinks.find(
      (link) =>
        currentPath === link.href || currentPath.startsWith(`${link.href}/`),
    );
    if (mainLink) return mainLink.label;

    const secondaryLink = secondaryLinks.find(
      (link) =>
        currentPath === link.href || currentPath.startsWith(`${link.href}/`),
    );
    if (secondaryLink) return secondaryLink.label;

    return 'Dashboard';
  };

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

  return (
    <>
      {/* Logout Confirmation Dialog */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Log out?
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setLogoutConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setLogoutConfirmOpen(true);
                  setOpen(false);
                  // Handle logout - you'll need to implement this
                  window.location.href = RoutePaths.LOGIN;
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
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
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                    <BuildingOfficeIcon className="h-5 w-5" aria-hidden />
                  </div>
                  <span className="truncate text-xl font-bold tracking-tight text-slate-900">
                    Testimonies Admin
                  </span>
                </Link>
                <span className="shrink-0 text-slate-400" aria-hidden>
                  ·
                </span>
                <span className="truncate text-sm font-bold text-slate-900">
                  {getRouteName()}
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
                  className={`absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-lg border border-slate-200 bg-white py-1 shadow-lg ${
                    isClosing
                      ? 'animate-dropdown-close'
                      : 'animate-dropdown-open'
                  }`}
                  role="menu"
                  onAnimationEnd={handleDropdownAnimationEnd}
                >
                  <div className="py-1">
                    {allLinks.map(({ href, label, icon: Icon }) => {
                      const isActive =
                        location.pathname === href ||
                        location.pathname.startsWith(`${href}/`);
                      return (
                        <Link
                          key={href}
                          to={href}
                          role="menuitem"
                          onClick={requestClose}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-primary text-white hover:bg-primary/90 [&_svg]:text-white'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" aria-hidden />
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="border-t border-slate-200" />
                  <div className="py-1">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        requestClose();
                        setLogoutConfirmOpen(true);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <ArrowRightOnRectangleIcon
                        className="h-4 w-4 shrink-0"
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
