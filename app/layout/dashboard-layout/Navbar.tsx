import autoAnimate from "@formkit/auto-animate";
import { useEffect, useRef, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { Link } from "react-router";
import { RoutePaths } from "../../routes/route-paths";
import { useAppSelector } from "../../store/hooks";

interface NavbarProps {
  onMenuClick?: () => void;
  ariaExpanded?: boolean;
}

const Navbar = ({ onMenuClick, ariaExpanded = false }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const { profile } = useAppSelector((state) => state.admin);
  const parentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (parentRef.current) {
      autoAnimate(parentRef.current);
    }
  }, []);

  const initials =
    profile != null
      ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
      : "";

  return (
    <nav className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 lg:px-6 h-16 flex items-center">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
              aria-label="Open menu"
              aria-expanded={ariaExpanded}
            >
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-4 rounded bg-gray-700" />
                <span className="block h-0.5 w-4 rounded bg-gray-700" />
                <span className="block h-0.5 w-4 rounded bg-gray-700" />
              </span>
            </button>
          )}

          <Link to={RoutePaths.DASHBOARD} className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-500 text-xs font-semibold text-white">
              T
            </div>
            <span className="text-sm font-semibold text-gray-900 truncate">
              Testimonies
            </span>
          </Link>
        </div>

        <div className="flex-1" />

        {profile && (
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <div ref={parentRef} className="relative flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  {initials}
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {profile.role.replace("-", " ")}
                  </span>
                </div>
              </button>

              {open && (
                <div className="absolute right-0 top-11 w-56 rounded-xl border border-gray-100 bg-white shadow-lg py-2">
                  <div className="px-3 pb-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                  </div>
                  <Link
                    to={RoutePaths.PROFILE_SETTINGS}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    Profile settings
                  </Link>
                </div>
              )}
            </div>
          </ClickAwayListener>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

