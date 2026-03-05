import { useEffect, useState } from 'react';
import { AdminSubscriptionsApi } from '../../api/adminSubscriptions';
import PageHeader from '../../common/page-header';
import { Table, type TableColumn } from '../../common/table';
import { getPaginatedResponse } from '../../functions/api-response';
import type { SubscriptionSummary } from '../../types';
import { sendCatchFeedback } from '../../functions/feedback';

export function meta() {
  return [
    { title: 'Active subscriptions | Testimonies Admin' },
    {
      name: 'description',
      content: 'View active subscriptions across the platform.',
    },
  ];
}

export default function ActiveSubscriptions() {
  const [items, setItems] = useState<SubscriptionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminSubscriptionsApi.listActive({
          page: 1,
          limit: 50,
        });
        const { results } = getPaginatedResponse<SubscriptionSummary>(
          data,
          'subscriptions',
        );
        setItems(results);
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
      id: 'user',
      header: 'User ID',
      accessor: (sub) => (
        <span className="text-xs font-mono text-gray-600">
          {sub.userId.slice(0, 8)}…
        </span>
      ),
    },
    {
      id: 'plan',
      header: 'Plan ID',
      accessor: (sub) => (
        <span className="text-xs font-mono text-gray-600">
          {sub.planId.slice(0, 8)}…
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (sub) => (
        <span className="text-xs font-medium text-emerald-700">Active</span>
      ),
    },
    {
      id: 'dates',
      header: 'Period',
      accessor: (sub) => (
        <span className="text-xs text-gray-600">
          {new Date(sub.startDate).toLocaleDateString()} –{' '}
          {new Date(sub.endDate).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Active subscriptions"
        description="Currently active user and organization subscriptions."
      />
      <Table columns={columns} data={items} loading={loading} />
    </>
  );
}
