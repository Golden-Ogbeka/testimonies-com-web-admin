import type React from 'react';
import { Outlet } from 'react-router';
import FullPageLoader from '../../common/full-page-loader';
import { useAuthGuard } from '../../hooks/useAuthGuard';

const AuthLayout: React.FC = () => {
  const { loading } = useAuthGuard('auth');

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(45,212,191,0.12),_transparent_55%)] pointer-events-none" />
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-[1.1fr,1fr] gap-10 items-center">
        <section className="hidden md:flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-emerald-400/30 w-fit">
            Testimonies Admin
          </div>
          <h1 className="text-3xl lg:text-4xl font-semibold leading-tight">
            Manage testimonies, users and subscriptions with confidence.
          </h1>
          <p className="text-sm text-slate-300 max-w-md">
            A focused workspace for moderating content, monitoring engagement
            and managing platform configuration without leaving important
            context behind.
          </p>
        </section>

        <section className="relative">
          <div className="rounded-2xl bg-white shadow-2xl shadow-emerald-500/20 p-6 sm:p-8 text-slate-900">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;
