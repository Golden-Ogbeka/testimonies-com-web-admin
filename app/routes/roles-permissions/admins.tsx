import { useEffect, useMemo, useState } from 'react';
import { AdminRolesPermissionsApi } from '../../api/adminRolesPermissions';
import FilterBar from '../../common/filter-bar';
import Modal from '../../common/modal';
import PageHeader from '../../common/page-header';
import { Table, type TableColumn } from '../../common/table';
import { getPaginatedResponse } from '../../functions/api-response';
import { sendCatchFeedback } from '../../functions/feedback';
import type { AdminAccount, AdminRole } from '../../types';

export function meta() {
  return [
    { title: 'Admin accounts | Testimonies Admin' },
    {
      name: 'description',
      content: 'Manage administrator accounts and access.',
    },
  ];
}

type AdminFormState = Pick<
  AdminAccount,
  'firstName' | 'lastName' | 'email' | 'phoneNumber' | 'role'
> & { password: string };

const emptyForm: AdminFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  role: 'admin',
  password: '',
};

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<AdminAccount | null>(null);
  const [form, setForm] = useState<AdminFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toggleId, setToggleId] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminRolesPermissionsApi.listAdmins({
          page: 1,
          limit: 100,
        });
        const { results } = getPaginatedResponse<AdminAccount>(data, 'admins');
        setAdmins(results);
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
    if (!query) return admins;
    return admins.filter((admin) => {
      const fullName = `${admin.firstName} ${admin.lastName}`.toLowerCase();
      return (
        fullName.includes(query) || admin.email.toLowerCase().includes(query)
      );
    });
  }, [admins, search]);

  const columns: TableColumn<AdminAccount>[] = [
    {
      id: 'name',
      header: 'Admin',
      accessor: (admin) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {`${admin.firstName.charAt(0)}${admin.lastName.charAt(0)}`.toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {admin.firstName} {admin.lastName}
            </span>
            <span className="text-xs text-gray-500">{admin.email}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      accessor: (admin) => (
        <span className="text-xs capitalize text-gray-600">{admin.role}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (admin) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            admin.active
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {admin.active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      id: 'verified',
      header: 'Verified',
      accessor: (admin) =>
        admin.emailIsVerified ? (
          <span className="text-xs text-emerald-600">Yes</span>
        ) : (
          <span className="text-xs text-gray-500">No</span>
        ),
    },
    {
      id: 'actions',
      header: '',
      accessor: (admin) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="text-xs font-medium text-gray-600 hover:underline"
            onClick={() => {
              setEditing(admin);
              setForm({
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                phoneNumber: admin.phoneNumber || '',
                role: admin.role,
                password: '',
              });
            }}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setToggleId(admin._id)}
            className="text-xs font-medium text-primary hover:underline"
          >
            {admin.active ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  const handleSave = async () => {
    try {
      setSaving(true);
      if (editing) {
        const { data } = await AdminRolesPermissionsApi.updateAdmin(
          editing._id,
          {
            firstName: form.firstName,
            lastName: form.lastName,
            phoneNumber: form.phoneNumber || undefined,
          },
        );
        setAdmins((prev) =>
          prev.map((a) => (a._id === editing._id ? data.data : a)),
        );
      } else {
        const { data } = await AdminRolesPermissionsApi.createAdmin({
          ...form,
          permissions: [],
        });
        setAdmins((prev) => [data.data, ...prev]);
      }
      setEditing(null);
      setForm(emptyForm);
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    if (!toggleId) return;
    const admin = admins.find((a) => a._id === toggleId);
    if (!admin) return;

    try {
      setToggling(true);
      if (admin.active) {
        await AdminRolesPermissionsApi.deactivateAdmin(admin._id);
        setAdmins((prev) =>
          prev.map((a) => (a._id === admin._id ? { ...a, active: false } : a)),
        );
      } else {
        await AdminRolesPermissionsApi.activateAdmin(admin._id);
        setAdmins((prev) =>
          prev.map((a) => (a._id === admin._id ? { ...a, active: true } : a)),
        );
      }
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setToggling(false);
      setToggleId(null);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  return (
    <>
      <PageHeader
        title="Admin accounts"
        description="Manage administrator accounts and their access levels."
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary/90"
          >
            New admin
          </button>
        }
      />

      <FilterBar searchValue={search} onSearchChange={setSearch} />

      <Table columns={columns} data={filtered} loading={loading} />

      <Modal
        open={editing !== null || form.email.length > 0}
        title={editing ? 'Edit admin' : 'New admin'}
        primaryLabel={editing ? 'Save changes' : 'Create admin'}
        onPrimary={handleSave}
        onClose={() => {
          setEditing(null);
          setForm(emptyForm);
        }}
        loading={saving}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="inputContainer">
              <label htmlFor="admin-first">First name</label>
              <input
                id="admin-first"
                value={form.firstName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, firstName: e.target.value }))
                }
              />
            </div>
            <div className="inputContainer">
              <label htmlFor="admin-last">Last name</label>
              <input
                id="admin-last"
                value={form.lastName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, lastName: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="inputContainer">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              disabled={!!editing}
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="admin-phone">Phone number (optional)</label>
            <input
              id="admin-phone"
              type="tel"
              value={form.phoneNumber}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
              }
            />
          </div>
          {!editing && (
            <>
              <div className="inputContainer">
                <label htmlFor="admin-password">Password</label>
                <input
                  id="admin-password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                />
              </div>
              <div className="inputContainer">
                <label htmlFor="admin-role">Role</label>
                <select
                  id="admin-role"
                  value={form.role}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      role: e.target.value as AdminRole,
                    }))
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super admin</option>
                </select>
              </div>
            </>
          )}
        </div>
      </Modal>

      <Modal
        open={toggleId !== null}
        title="Confirm status change"
        primaryLabel="Confirm"
        onPrimary={handleToggle}
        onClose={() => setToggleId(null)}
        loading={toggling}
      >
        <p className="text-sm text-gray-700">
          Are you sure you want to{' '}
          {admins.find((a) => a._id === toggleId)?.active
            ? 'deactivate'
            : 'activate'}{' '}
          this admin account?
        </p>
      </Modal>
    </>
  );
}
