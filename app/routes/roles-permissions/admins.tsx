import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toPascalCase } from '~/functions/stringManipulation';
import { AdminRolesPermissionsApi } from '../../api/adminRolesPermissions';
import FilterBar from '../../common/filter-bar';
import Modal from '../../common/modal';
import PageHeader from '../../common/page-header';
import PaginationControls from '../../common/pagination-controls';
import SelectInput from '../../common/select-input';
import { Table, type TableColumn } from '../../common/table';
import {
  getPaginatedResponse,
  getResponseResource,
} from '../../functions/api-response';
import { sendCatchFeedback } from '../../functions/feedback';
import {
  createAdminSchema,
  updateAdminSchema,
  type CreateAdminFormData,
  type UpdateAdminFormData,
} from '../../schemas';
import type { AdminAccount, AdminRole, PaginationMeta } from '../../types';

export function meta() {
  return [
    { title: 'Admin accounts | Testimonies Admin' },
    {
      name: 'description',
      content: 'Manage administrator accounts and access.',
    },
  ];
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<AdminAccount | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toggleId, setToggleId] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<'all' | AdminRole>('all');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');
  const [pagination, setPagination] = useState<PaginationMeta>({
    totalResults: 0,
    resultsPerPage: 20,
    totalPages: 1,
    currentPage: 1,
    prevPage: null,
    nextPage: null,
  });

  // Create form
  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    formState: { errors: createErrors, isSubmitting: isCreating },
    reset: resetCreate,
  } = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: 'admin',
      permissions: [],
    },
  });

  // Edit form
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    formState: { errors: editErrors, isSubmitting: isEditing },
    reset: resetEdit,
  } = useForm<UpdateAdminFormData>({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: 'admin',
      permissions: [],
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminRolesPermissionsApi.listAdmins({
          page,
          limit: 20,
          role: roleFilter === 'all' ? undefined : roleFilter,
          isActive:
            statusFilter === 'all' ? undefined : statusFilter === 'active',
        });

        const { results, pagination: pageMeta } =
          getPaginatedResponse<AdminAccount>(data, 'admins');
        setAdmins(results);
        setPagination(pageMeta);
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, roleFilter, statusFilter]);

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
        <span className="text-xs capitalize text-gray-600">
          {toPascalCase(admin.role)}
        </span>
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
            onClick={() => openEdit(admin)}
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

  const openEdit = (admin: AdminAccount) => {
    setEditing(admin);
    resetEdit({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phoneNumber: admin.phoneNumber || '',
      role: admin.role,
      permissions: [],
    });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditing(null);
    resetCreate({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: 'admin',
      permissions: [],
    });
    setShowModal(true);
  };

  const onCreateSave = async (data: CreateAdminFormData) => {
    try {
      const { data: response } = await AdminRolesPermissionsApi.createAdmin({
        ...data,
        role: data.role || 'admin',
        permissions: data.permissions ?? [],
      });
      const createdAdmin = getResponseResource<AdminAccount>(response, 'admin');
      setAdmins((prev) => [createdAdmin, ...prev]);
      setShowModal(false);
      resetCreate();
    } catch (error) {
      sendCatchFeedback(error);
    }
  };

  const onEditSave = async (data: UpdateAdminFormData) => {
    if (!editing) return;
    try {
      const { data: response } = await AdminRolesPermissionsApi.updateAdmin(
        editing._id,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber || undefined,
        },
      );
      let updatedAdmin = getResponseResource<AdminAccount>(response, 'admin');
      if (data.role && data.role !== editing.role) {
        const { data: roleResponse } =
          await AdminRolesPermissionsApi.updateAdminRole(editing._id, data.role);
        updatedAdmin = getResponseResource<AdminAccount>(
          roleResponse,
          'admin',
        );
      }
      setAdmins((prev) =>
        prev.map((a) => (a._id === editing._id ? updatedAdmin : a)),
      );
      setEditing(null);
      setShowModal(false);
      resetEdit();
    } catch (error) {
      sendCatchFeedback(error);
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

      <FilterBar searchValue={search} onSearchChange={setSearch}>
        <SelectInput
          value={roleFilter}
          onChange={(value) => {
            setRoleFilter(value as 'all' | AdminRole);
            setPage(1);
          }}
          options={[
            { value: 'all', label: 'All roles' },
            { value: 'admin', label: 'Admin' },
            { value: 'super-admin', label: 'Super admin' },
          ]}
        />
        <SelectInput
          value={statusFilter}
          onChange={(value) => {
            setStatusFilter(value as 'all' | 'active' | 'inactive');
            setPage(1);
          }}
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />
      </FilterBar>

      <Table
        columns={columns}
        data={filtered}
        loading={loading}
        getRowKey={(admin) => admin._id}
        mobileTitle={(admin) => `${admin.firstName} ${admin.lastName}`}
        mobileSubtitle={(admin) => admin.email}
        mobileActions={(admin) => (
          <div className="flex gap-3">
            <button
              type="button"
              className="text-xs font-medium text-gray-600 hover:underline"
              onClick={() => openEdit(admin)}
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
        )}
      />
      <PaginationControls
        page={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalResults={pagination.totalResults}
        onPageChange={setPage}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={showModal}
        title={editing ? 'Edit admin' : 'New admin'}
        primaryLabel={editing ? 'Save changes' : 'Create admin'}
        onPrimary={
          editing
            ? handleEditSubmit(onEditSave)
            : handleCreateSubmit(onCreateSave)
        }
        onClose={() => {
          setEditing(null);
          setShowModal(false);
        }}
        loading={editing ? isEditing : isCreating}
      >
        {editing ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="inputContainer">
                <label htmlFor="admin-first">First name</label>
                <input id="admin-first" {...registerEdit('firstName')} />
                {editErrors.firstName && (
                  <p className="mt-1 text-xs text-red-600">
                    {editErrors.firstName.message}
                  </p>
                )}
              </div>
              <div className="inputContainer">
                <label htmlFor="admin-last">Last name</label>
                <input id="admin-last" {...registerEdit('lastName')} />
                {editErrors.lastName && (
                  <p className="mt-1 text-xs text-red-600">
                    {editErrors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="inputContainer">
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                type="email"
                {...registerEdit('email')}
                disabled
              />
            </div>
            <div className="inputContainer">
              <label htmlFor="admin-phone">Phone number (optional)</label>
              <input
                id="admin-phone"
                type="tel"
                {...registerEdit('phoneNumber')}
              />
              {editErrors.phoneNumber && (
                <p className="mt-1 text-xs text-red-600">
                  {editErrors.phoneNumber.message}
                </p>
              )}
            </div>
            <div className="inputContainer">
              <label htmlFor="admin-role-edit">Role</label>
              <select id="admin-role-edit" {...registerEdit('role')}>
                <option value="admin">Admin</option>
                <option value="super-admin">Super admin</option>
              </select>
              {editErrors.role && (
                <p className="mt-1 text-xs text-red-600">
                  {editErrors.role.message}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="inputContainer">
                <label htmlFor="admin-first">First name</label>
                <input id="admin-first" {...registerCreate('firstName')} />
                {createErrors.firstName && (
                  <p className="mt-1 text-xs text-red-600">
                    {createErrors.firstName.message}
                  </p>
                )}
              </div>
              <div className="inputContainer">
                <label htmlFor="admin-last">Last name</label>
                <input id="admin-last" {...registerCreate('lastName')} />
                {createErrors.lastName && (
                  <p className="mt-1 text-xs text-red-600">
                    {createErrors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="inputContainer">
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                type="email"
                {...registerCreate('email')}
              />
              {createErrors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {createErrors.email.message}
                </p>
              )}
            </div>

            <div className="inputContainer">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                {...registerCreate('password')}
              />
              {createErrors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {createErrors.password.message}
                </p>
              )}
            </div>
            <div className="inputContainer">
              <label htmlFor="admin-phone">Phone number (optional)</label>
              <input
                id="admin-phone"
                type="tel"
                {...registerCreate('phoneNumber')}
              />
              {createErrors.phoneNumber && (
                <p className="mt-1 text-xs text-red-600">
                  {createErrors.phoneNumber.message}
                </p>
              )}
            </div>
            <div className="inputContainer">
              <label htmlFor="admin-role">Role</label>
              <select id="admin-role" {...registerCreate('role')}>
                <option value="admin">Admin</option>
                <option value="super-admin">Super admin</option>
              </select>
              {createErrors.role && (
                <p className="mt-1 text-xs text-red-600">
                  {createErrors.role.message}
                </p>
              )}
            </div>
          </div>
        )}
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
