import { useEffect, useState } from "react";
import { AdminUsersApi } from "../../api/adminUsers";
import { AdminTestimoniesApi } from "../../api/adminTestimonies";
import PageHeader from "../../common/page-header";
import type { AdminUserStats, AdminTestimonyAnalyticsItem } from "../../types";
import { sendCatchFeedback } from "../../functions/feedback";

interface DashboardState {
  userStats?: AdminUserStats;
  topEngagement?: AdminTestimonyAnalyticsItem[];
}

export function meta() {
  return [
    { title: "Dashboard | Testimonies Admin" },
    {
      name: "description",
      content: "Overview of Testimonies users, content and engagement.",
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
        setState({
          userStats: usersRes.data.data,
          topEngagement: engagementRes.data.data,
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
        />
        <MetricCard
          label="Active users"
          value={userStats?.activeUsers ?? 0}
          loading={loading}
        />
        <MetricCard
          label="Flagged users"
          value={userStats?.flaggedUsers ?? 0}
          loading={loading}
        />
        <MetricCard
          label="Verified users"
          value={userStats?.verifiedUsers ?? 0}
          loading={loading}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">
            Top testimonies by engagement
          </h2>
          {loading && (
            <p className="text-sm text-gray-500">Loading engagement analytics…</p>
          )}
          {!loading && (!topEngagement || topEngagement.length === 0) && (
            <p className="text-sm text-gray-500">
              No engagement analytics are available yet.
            </p>
          )}
          {!loading && topEngagement && topEngagement.length > 0 && (
            <ul className="mt-2 space-y-2">
              {topEngagement.map((item) => (
                <li
                  key={item.testimonyId}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
                >
                  <span className="truncate pr-2">
                    {item.title ?? `Testimony ${item.testimonyId.slice(-6)}`}
                  </span>
                  <span className="text-xs font-medium text-gray-600">
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
}

function MetricCard({ label, value, loading }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">
        {loading ? "…" : value.toLocaleString()}
      </p>
    </div>
  );
}

