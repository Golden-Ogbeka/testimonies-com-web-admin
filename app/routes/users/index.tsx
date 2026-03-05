import { useEffect, useMemo, useState } from 'react';
import { AdminUsersApi } from '../../api/adminUsers';
import FilterBar from '../../common/filter-bar';
import Modal from '../../common/modal';
import PageHeader from '../../common/page-header';
import { Table, type TableColumn } from '../../common/table';
import { getPaginatedResponse } from '../../functions/api-response';
import { sendCatchFeedback } from '../../functions/feedback';
import type { AdminUserSummary } from '../../types';

export function meta() {
  return [
    { title: 'Users | Testimonies Admin' },
    {
      name: 'description',
      content: 'Manage all users on the Testimonies platform.',
    },
  ];
}

export default function UsersIndex() {
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toggleUserId, setToggleUserId] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminUsersApi.list({ page: 1, limit: 50 });
        const { results: userResults } = getPaginatedResponse<AdminUserSummary>(
          data,
          'users',
        );
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
        const { results: organizationResults } =
          getPaginatedResponse<OrganizationItem>(data, 'organizations');
        const mappedOrganizations: AdminUserSummary[] = organizationResults.map(
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
        setUsers([...userResults, ...mappedOrganizations]);
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        fullName.includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.username ?? '').toLowerCase().includes(query)
      );
    });
  }, [users, search]);

  const columns: TableColumn<AdminUserSummary>[] = [
    {
      id: 'name',
      header: 'User',
      accessor: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-xs text-gray-500">{user.email}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'accountType',
      header: 'Account',
      accessor: (user) => (
        <span className="text-xs capitalize text-gray-600">
          {user.accountType}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (user) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            user.active
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {user.active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      id: 'flag',
      header: 'Flagged',
      accessor: (user) =>
        user.isFlagged ? (
          <span className="text-xs font-medium text-red-600">Yes</span>
        ) : (
          <span className="text-xs text-gray-500">No</span>
        ),
    },
    {
      id: 'actions',
      header: '',
      accessor: (user) => (
        <button
          type="button"
          onClick={() => setToggleUserId(user._id)}
          className="text-xs font-medium text-primary hover:underline"
        >
          {user.active ? 'Deactivate' : 'Activate'}
        </button>
      ),
      className: 'text-right',
    },
  ];

  const handleConfirmToggle = async () => {
    if (!toggleUserId) return;
    const user = users.find((u) => u._id === toggleUserId);
    if (!user) return;

    try {
      setToggling(true);
      if (user.active) {
        await AdminUsersApi.deactivate(user._id);
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, active: false } : u)),
        );
      } else {
        await AdminUsersApi.activate(user._id);
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, active: true } : u)),
        );
      }
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setToggling(false);
      setToggleUserId(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Users"
        description="View and manage users across the Testimonies platform."
      />

      <FilterBar searchValue={search} onSearchChange={setSearch} />

      <Table columns={columns} data={filtered} loading={loading} />

      <Modal
        open={toggleUserId !== null}
        title="Confirm status change"
        primaryLabel="Confirm"
        onPrimary={handleConfirmToggle}
        onClose={() => setToggleUserId(null)}
        loading={toggling}
      >
        <p className="text-sm text-gray-700">
          Are you sure you want to{' '}
          {users.find((u) => u._id === toggleUserId)?.active
            ? 'deactivate'
            : 'activate'}{' '}
          this user&apos;s account?
        </p>
      </Modal>
    </>
  );
}
