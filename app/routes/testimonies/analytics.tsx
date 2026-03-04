import { useEffect, useState } from "react";
import { AdminTestimoniesApi } from "../../api/adminTestimonies";
import PageHeader from "../../common/page-header";
import { Table, type TableColumn } from "../../common/table";
import { sendCatchFeedback } from "../../functions/feedback";
import type { AdminTestimonyAnalyticsItem } from "../../types";

export function meta() {
  return [
    { title: "Testimony analytics | Testimonies Admin" },
    { name: "description", content: "View testimony engagement and performance metrics." },
  ];
}

export default function TestimonyAnalytics() {
  const [highestEngagement, setHighestEngagement] = useState<AdminTestimonyAnalyticsItem[]>([]);
  const [highestLikes, setHighestLikes] = useState<AdminTestimonyAnalyticsItem[]>([]);
  const [highestViews, setHighestViews] = useState<AdminTestimonyAnalyticsItem[]>([]);
  const [mostActiveUsers, setMostActiveUsers] = useState<AdminTestimonyAnalyticsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [engagement, likes, views, active] = await Promise.all([
          AdminTestimoniesApi.analyticsHighestEngagement(10),
          AdminTestimoniesApi.analyticsHighestLikes(10),
          AdminTestimoniesApi.analyticsHighestViews(10),
          AdminTestimoniesApi.analyticsMostActiveUsers(10),
        ]);
        setHighestEngagement(engagement.data.data);
        setHighestLikes(likes.data.data);
        setHighestViews(views.data.data);
        setMostActiveUsers(active.data.data);
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const testimonyColumns: TableColumn<AdminTestimonyAnalyticsItem>[] = [
    {
      id: "testimony",
      header: "Testimony",
      accessor: (item) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {item.title || "Untitled"}
          </span>
          <span className="text-xs font-mono text-gray-500">
            {item.testimonyId.slice(0, 12)}…
          </span>
        </div>
      ),
    },
    {
      id: "count",
      header: "Count",
      accessor: (item) => (
        <span className="text-sm font-semibold text-primary">{item.count}</span>
      ),
    },
  ];

  const userColumns: TableColumn<AdminTestimonyAnalyticsItem>[] = [
    {
      id: "user",
      header: "User",
      accessor: (item) => (
        <span className="text-sm font-mono text-gray-900">
          {item.userId.slice(0, 12)}…
        </span>
      ),
    },
    {
      id: "count",
      header: "Count",
      accessor: (item) => (
        <span className="text-sm font-semibold text-primary">{item.count}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Testimony analytics"
        description="Track testimony performance and user engagement metrics."
      />

      <div className="space-y-6">
        <div className="card">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Highest engagement
          </h3>
          <Table columns={testimonyColumns} data={highestEngagement} loading={false} />
        </div>

        <div className="card">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Most likes</h3>
          <Table columns={testimonyColumns} data={highestLikes} loading={false} />
        </div>

        <div className="card">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Most views</h3>
          <Table columns={testimonyColumns} data={highestViews} loading={false} />
        </div>

        <div className="card">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Most active users
          </h3>
          <Table columns={userColumns} data={mostActiveUsers} loading={false} />
        </div>
      </div>
    </>
  );
}
