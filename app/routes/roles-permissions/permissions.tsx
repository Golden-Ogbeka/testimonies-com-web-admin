import { useEffect, useState } from 'react';
import { AdminRolesPermissionsApi } from '../../api/adminRolesPermissions';
import PaginationControls from '../../common/pagination-controls';
import PageHeader from '../../common/page-header';
import { Table, type TableColumn } from '../../common/table';
import Modal from '../../common/modal';
import {
  getPaginatedResponse,
  getResponseResource,
} from '../../functions/api-response';
import type { AdminPermission, PaginationMeta } from '../../types';
import { sendCatchFeedback } from '../../functions/feedback';

export function meta() {
  return [
    { title: 'Permissions | Testimonies Admin' },
    {
      name: 'description',
      content: 'Configure fine-grained admin permissions.',
    },
  ];
}

type PermissionFormState = Pick<AdminPermission, 'name' | 'description'>;

const emptyForm: PermissionFormState = {
  name: '',
  description: '',
};

export default function PermissionsPage() {
  const [items, setItems] = useState<AdminPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminPermission | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<PermissionFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    totalResults: 0,
    resultsPerPage: 20,
    totalPages: 1,
    currentPage: 1,
    prevPage: null,
    nextPage: null,
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminRolesPermissionsApi.listPermissions({
          page,
          limit: 20,
        });
        const { results, pagination: pageMeta } =
          getPaginatedResponse<AdminPermission>(data, 'permissions');
        setItems(results);
        setPagination(pageMeta);
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page]);

  const columns: TableColumn<AdminPermission>[] = [
    {
      id: 'name',
      header: 'Permission',
      accessor: (perm) => (
        <span className="text-sm font-medium text-gray-900">{perm.name}</span>
      ),
    },
    {
      id: 'description',
      header: 'Description',
      accessor: (perm) => (
        <span className="text-xs text-gray-600">{perm.description}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      accessor: (perm) => (
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setEditing(perm);
              setForm({ name: perm.name, description: perm.description });
              setShowModal(true);
            }}
            className="text-xs font-medium text-gray-600 hover:underline"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(perm._id)}
            className="text-xs font-medium text-red-600 hover:underline"
          >
            Delete
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
        const { data } = await AdminRolesPermissionsApi.updatePermission(
          editing._id,
          {
            name: form.name,
            description: form.description,
          },
        );
        const updatedPermission = getResponseResource<AdminPermission>(
          data,
          'permission',
        );
        setItems((prev) =>
          prev.map((p) => (p._id === editing._id ? updatedPermission : p)),
        );
      } else {
        const { data } = await AdminRolesPermissionsApi.createPermission(form);
        const createdPermission = getResponseResource<AdminPermission>(
          data,
          'permission',
        );
        setItems((prev) => [createdPermission, ...prev]);
      }
      setEditing(null);
      setForm(emptyForm);
      setShowModal(false);
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await AdminRolesPermissionsApi.deletePermission(deleteId);
      setItems((prev) => prev.filter((item) => item._id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Permissions"
        description="Define permissions that can be assigned to admin roles."
        actions={
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm(emptyForm);
              setShowModal(true);
            }}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary/90"
          >
            New permission
          </button>
        }
      />

      <Table
        columns={columns}
        data={items}
        loading={loading}
        getRowKey={(perm) => perm._id}
        mobileTitle={(perm) => perm.name}
        mobileSubtitle={(perm) => perm.description}
        mobileActions={(perm) => (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setEditing(perm);
                setForm({ name: perm.name, description: perm.description });
                setShowModal(true);
              }}
              className="text-xs font-medium text-gray-600 hover:underline"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setDeleteId(perm._id)}
              className="text-xs font-medium text-red-600 hover:underline"
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
        onPrimary={handleSave}
        onClose={() => {
          setEditing(null);
          setForm(emptyForm);
          setShowModal(false);
        }}
        loading={saving}
      >
        <div className="space-y-3">
          <div className="inputContainer">
            <label htmlFor="perm-name">Name</label>
            <input
              id="perm-name"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="perm-description">Description</label>
            <textarea
              id="perm-description"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              rows={3}
            />
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
