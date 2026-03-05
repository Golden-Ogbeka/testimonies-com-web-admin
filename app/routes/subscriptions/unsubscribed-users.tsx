import { useEffect, useState } from 'react';
import { AdminSubscriptionsApi } from '../../api/adminSubscriptions';
import PageHeader from '../../common/page-header';
import { Table, type TableColumn } from '../../common/table';
import { getPaginatedResponse } from '../../functions/api-response';
import { sendCatchFeedback } from '../../functions/feedback';
import type { AdminUserSummary } from '../../types';

export function meta() {
  return [
    { title: 'Unsubscribed users | Testimonies Admin' },
    {
      name: 'description',
      content: 'Users who do not have an active subscription.',
    },
  ];
}

export default function UnsubscribedUsers() {
  const [items, setItems] = useState<AdminUserSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminSubscriptionsApi.listUnsubscribedUsers({
          page: 1,
          limit: 50,
        });
        type OrganizationItem = {
          _id: string;
          businessName?: string;
          businessEmail?: string;
          username?: string;
          active?: boolean;
          isFlagged?: boolean;
          accountType?: string;
          subscriptionType?: string;
          createdAt?: string;
        };

        const { results: users } = getPaginatedResponse<AdminUserSummary>(
          data,
          'users',
        );
        const { results: organizations } =
          getPaginatedResponse<OrganizationItem>(data, 'organizations');
        const mappedOrganizations: AdminUserSummary[] = organizations.map(
          (org) => ({
            _id: org._id,
            firstName: org.businessName || 'Organization',
            lastName: '',
            email: org.businessEmail || '',
            username: org.username,
            active: org.active ?? true,
            isFlagged: org.isFlagged ?? false,
            accountType: org.accountType ?? 'organization',
            subscriptionType: org.subscriptionType,
            createdAt: org.createdAt || new Date().toISOString(),
          }),
        );

        setItems([...users, ...mappedOrganizations]);
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const columns: TableColumn<AdminUserSummary>[] = [
    {
      id: 'user',
      header: 'User',
      accessor: (user) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-900">
            {[user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
              'Unknown'}
          </span>
          <span className="text-xs text-gray-600">{user.email}</span>
        </div>
      ),
    },
    {
      id: 'type',
      header: 'User type',
      accessor: (user) => (
        <span className="text-xs capitalize text-gray-600">
          {user.accountType}
        </span>
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
