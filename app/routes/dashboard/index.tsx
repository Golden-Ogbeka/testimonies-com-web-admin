import { useEffect, useState } from 'react';
import { AdminTestimoniesApi } from '../../api/adminTestimonies';
import { AdminUsersApi } from '../../api/adminUsers';
import PageHeader from '../../common/page-header';
import { getResponseResource } from '../../functions/api-response';
import { sendCatchFeedback } from '../../functions/feedback';
import type { AdminTestimonyAnalyticsItem, AdminUserStats } from '../../types';

interface DashboardState {
  userStats?: AdminUserStats;
  topEngagement?: AdminTestimonyAnalyticsItem[];
}

export function meta() {
  return [
    { title: 'Dashboard | Testimonies Admin' },
    {
      name: 'description',
      content: 'Overview of Testimonies users, content and engagement.',
    },
  ];
}

export default function DashboardIndex() {
  const [state, setState] = useState<DashboardState>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [usersRes, engagementRes] = await Promise.all([
          AdminUsersApi.statsAll(),
          AdminTestimoniesApi.analyticsHighestEngagement(5),
        ]);

        const testimoniesData = engagementRes.data.data as unknown as {
          testimonies: any[];
        };
        setState({
          userStats: usersRes.data.data,
          topEngagement: getResponseResource<AdminTestimonyAnalyticsItem[]>(
            engagementRes.data,
            'testimonies',
          ),
        });
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const { userStats, topEngagement } = state;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="High-level metrics across users and testimonies."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total users"
          value={userStats?.totalUsers ?? 0}
          loading={loading}
          color="blue"
        />
        <MetricCard
          label="Active users"
          value={userStats?.activeUsers ?? 0}
          loading={loading}
          color="emerald"
        />
        <MetricCard
          label="Flagged users"
          value={userStats?.flaggedUsers ?? 0}
          loading={loading}
          color="amber"
        />
        <MetricCard
          label="Verified users"
          value={userStats?.verifiedUsers ?? 0}
          loading={loading}
          color="purple"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Top testimonies by engagement
          </h2>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="ml-2 text-sm text-slate-500">
                Loading analytics…
              </span>
            </div>
          )}
          {!loading && (!topEngagement || topEngagement.length === 0) && (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-500">
                No engagement analytics are available yet.
              </p>
            </div>
          )}
          {!loading && topEngagement && topEngagement.length > 0 && (
            <ul className="space-y-3">
              {topEngagement.map((item, index) => (
                <li
                  key={item._id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm transition-colors hover:bg-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <span className="truncate font-medium text-slate-900">
                      {item.title ?? `Testimony ${item._id.slice(-6)}`}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {item.count.toLocaleString()} interactions
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: number;
  loading?: boolean;
  color?: 'blue' | 'emerald' | 'amber' | 'purple';
}

function MetricCard({
  label,
  value,
  loading,
  color = 'blue',
}: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const iconColors = {
    blue: 'text-blue-500',
    emerald: 'text-emerald-500',
    amber: 'text-amber-500',
    purple: 'text-purple-500',
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <div
          className={`h-8 w-8 rounded-lg ${colorClasses[color].split(' ')[0]} flex items-center justify-center`}
        >
          <div className={`h-4 w-4 rounded-full ${iconColors[color]}`} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">
        {loading ? '…' : value.toLocaleString()}
      </p>
    </div>
  );
}
