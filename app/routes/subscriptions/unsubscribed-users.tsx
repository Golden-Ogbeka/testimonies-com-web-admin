import { useEffect, useState } from "react";
import { AdminSubscriptionsApi } from "../../api/adminSubscriptions";
import PageHeader from "../../common/page-header";
import { Table, type TableColumn } from "../../common/table";
import { sendCatchFeedback } from "../../functions/feedback";
import type { SubscriptionSummary } from "../../types";

export function meta() {
  return [
    { title: "Unsubscribed users | Testimonies Admin" },
    { name: "description", content: "Users who do not have an active subscription." },
  ];
}

export default function UnsubscribedUsers() {
  const [items, setItems] = useState<SubscriptionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminSubscriptionsApi.listUnsubscribedUsers({
          page: 1,
          limit: 50,
        });
        setItems(data.data);
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const columns: TableColumn<SubscriptionSummary>[] = [
    {
      id: "user",
      header: "User ID",
      accessor: (sub) => (
        <span className="text-xs font-mono text-gray-600">
          {sub.userId.slice(0, 8)}…
        </span>
      ),
    },
    {
      id: "type",
      header: "User type",
      accessor: (sub) => (
        <span className="text-xs capitalize text-gray-600">{sub.userType}</span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Unsubscribed users"
        description="Users or organizations without any active subscription."
      />
      <Table columns={columns} data={items} loading={loading} />
    </>
  );
}

