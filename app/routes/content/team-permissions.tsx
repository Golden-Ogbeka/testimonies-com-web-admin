import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AdminContentApi } from '../../api/adminContent';
import FilterBar from '../../common/filter-bar';
import Modal from '../../common/modal';
import PaginationControls from '../../common/pagination-controls';
import PageHeader from '../../common/page-header';
import { Table, type TableColumn } from '../../common/table';
import {
  getPaginatedResponse,
  getResponseResource,
} from '../../functions/api-response';
import { sendCatchFeedback } from '../../functions/feedback';
import {
  createPermissionSchema,
  type CreatePermissionFormData,
} from '../../schemas';
import type { PaginationMeta, TeamPermissionItem } from '../../types';

export function meta() {
  return [
    { title: 'Team permissions | Testimonies Admin' },
    { name: 'description', content: 'Manage team permission definitions.' },
  ];
}

type TeamPermissionApiItem = Omit<TeamPermissionItem, 'permission'> & {
  name?: string;
  permission?: string;
};

const mapTeamPermission = (
  item: TeamPermissionApiItem,
): TeamPermissionItem => ({
  ...item,
  permission: item.permission ?? item.name ?? '',
});

export default function TeamPermissionsPage() {
  const [permissions, setPermissions] = useState<TeamPermissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<TeamPermissionItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    totalResults: 0,
    resultsPerPage: 20,
    totalPages: 1,
    currentPage: 1,
    prevPage: null,
    nextPage: null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreatePermissionFormData>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: {
      permission: '',
      description: '',
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminContentApi.listTeamPermissions({
          page,
          limit: 20,
        });
        const { results, pagination: pageMeta } =
          getPaginatedResponse<TeamPermissionApiItem>(data, 'teamPermissions');
        setPermissions(results.map(mapTeamPermission));
        setPagination(pageMeta);
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return permissions;
    return permissions.filter(
      (perm) =>
        perm.permission.toLowerCase().includes(query) ||
        perm.description.toLowerCase().includes(query),
    );
  }, [permissions, search]);

  const columns: TableColumn<TeamPermissionItem>[] = [
    {
      id: 'permission',
      header: 'Permission',
      accessor: (perm) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {perm.permission}
          </span>
          <span className="text-xs text-gray-500">{perm.description}</span>
        </div>
      ),
    },
    {
      id: 'created',
      header: 'Created',
      accessor: (perm) => (
        <span className="text-xs text-gray-600">
          {new Date(perm.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      accessor: (perm) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="text-xs font-medium text-gray-600 hover:underline"
            onClick={() => {
              setEditing(perm);
              reset({
                permission: perm.permission,
                description: perm.description,
              });
              setShowModal(true);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="text-xs font-medium text-red-600 hover:underline"
            onClick={() => setDeleteId(perm._id)}
          >
            Delete
          </button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  const onSave = async (data: CreatePermissionFormData) => {
    try {
      if (editing) {
        const { data: response } = await AdminContentApi.updateTeamPermission(
          editing._id,
          data,
        );
        const updated = mapTeamPermission(
          getResponseResource<TeamPermissionApiItem>(
            response,
            'teamPermission',
          ),
        );
        setPermissions((prev) =>
          prev.map((p) => (p._id === editing._id ? updated : p)),
        );
      } else {
        const { data: response } =
          await AdminContentApi.createTeamPermission(data);
        const created = mapTeamPermission(
          getResponseResource<TeamPermissionApiItem>(
            response,
            'teamPermission',
          ),
        );
        setPermissions((prev) => [created, ...prev]);
      }
      setEditing(null);
      reset({ permission: '', description: '' });
      setShowModal(false);
    } catch (error) {
      sendCatchFeedback(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await AdminContentApi.deleteTeamPermission(deleteId);
      setPermissions((prev) => prev.filter((p) => p._id !== deleteId));
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const openCreate = () => {
    setEditing(null);
    reset({ permission: '', description: '' });
    setShowModal(true);
  };

  return (
    <>
      <PageHeader
        title="Team permissions"
        description="Define permissions that can be assigned to team members."
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary/90"
          >
            New permission
          </button>
        }
      />

      <FilterBar searchValue={search} onSearchChange={setSearch} />

      <Table
        columns={columns}
        data={filtered}
        loading={loading}
        getRowKey={(perm) => perm._id}
        mobileTitle={(perm) => perm.permission}
        mobileSubtitle={(perm) => perm.description}
        mobileActions={(perm) => (
          <div className="flex gap-3">
            <button
              type="button"
              className="text-xs font-medium text-gray-600 hover:underline"
              onClick={() => {
                setEditing(perm);
                reset({
                  permission: perm.permission,
                  description: perm.description,
                });
                setShowModal(true);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              className="text-xs font-medium text-red-600 hover:underline"
              onClick={() => setDeleteId(perm._id)}
            >
              Delete
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

      <Modal
        open={showModal}
        title={editing ? 'Edit permission' : 'New permission'}
        primaryLabel={editing ? 'Save changes' : 'Create permission'}
        onPrimary={handleSubmit(onSave)}
        onClose={() => {
          setEditing(null);
          reset({ permission: '', description: '' });
          setShowModal(false);
        }}
        loading={isSubmitting}
      >
        <div className="space-y-3">
          <div className="inputContainer">
            <label htmlFor="perm-name">Permission name</label>
            <input
              id="perm-name"
              {...register('permission')}
              placeholder="e.g., manage_users"
            />
            {errors.permission && (
              <p className="mt-1 text-xs text-red-600">
                {errors.permission.message}
              </p>
            )}
          </div>
          <div className="inputContainer">
            <label htmlFor="perm-description">Description</label>
            <textarea
              id="perm-description"
              {...register('description')}
              rows={3}
              placeholder="Describe what this permission allows…"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        open={deleteId !== null}
        title="Delete permission"
        primaryLabel="Delete"
        onPrimary={handleDelete}
        onClose={() => setDeleteId(null)}
        loading={deleting}
      >
        <p className="text-sm text-gray-700">
          Are you sure you want to delete this permission? This action cannot be
          undone.
        </p>
      </Modal>
    </>
  );
}
