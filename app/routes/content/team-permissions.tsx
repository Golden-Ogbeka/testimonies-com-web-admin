import { useEffect, useMemo, useState } from "react";
import { AdminContentApi } from "../../api/adminContent";
import FilterBar from "../../common/filter-bar";
import Modal from "../../common/modal";
import PageHeader from "../../common/page-header";
import { Table, type TableColumn } from "../../common/table";
import { getPaginatedResponse, getResponseData } from "../../functions/api-response";
import { sendCatchFeedback } from "../../functions/feedback";
import type { TeamPermissionItem } from "../../types";

export function meta() {
  return [
    { title: "Team permissions | Testimonies Admin" },
    { name: "description", content: "Manage team permission definitions." },
  ];
}

type PermissionFormState = Pick<TeamPermissionItem, "permission" | "description">;

const emptyForm: PermissionFormState = {
  permission: "",
  description: "",
};

type TeamPermissionApiItem = Omit<TeamPermissionItem, "permission"> & {
  name?: string;
  permission?: string;
};

const mapTeamPermission = (item: TeamPermissionApiItem): TeamPermissionItem => ({
  ...item,
  permission: item.permission ?? item.name ?? "",
});

export default function TeamPermissionsPage() {
  const [permissions, setPermissions] = useState<TeamPermissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<TeamPermissionItem | null>(null);
  const [form, setForm] = useState<PermissionFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminContentApi.listTeamPermissions({ page: 1, limit: 100 });
        const { results } = getPaginatedResponse<TeamPermissionApiItem>(
          data,
          "teamPermissions",
        );
        setPermissions(results.map(mapTeamPermission));
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
    if (!query) return permissions;
    return permissions.filter((perm) =>
      perm.permission.toLowerCase().includes(query) ||
      perm.description.toLowerCase().includes(query)
    );
  }, [permissions, search]);

  const columns: TableColumn<TeamPermissionItem>[] = [
    {
      id: "permission",
      header: "Permission",
      accessor: (perm) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{perm.permission}</span>
          <span className="text-xs text-gray-500">{perm.description}</span>
        </div>
      ),
    },
    {
      id: "created",
      header: "Created",
      accessor: (perm) => (
        <span className="text-xs text-gray-600">
          {new Date(perm.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      accessor: (perm) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="text-xs font-medium text-gray-600 hover:underline"
            onClick={() => {
              setEditing(perm);
              setForm({
                permission: perm.permission,
                description: perm.description,
              });
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
      className: "text-right",
    },
  ];

  const handleSave = async () => {
    try {
      setSaving(true);
      if (editing) {
        const { data } = await AdminContentApi.updateTeamPermission(editing._id, form);
        const updated = mapTeamPermission(getResponseData<TeamPermissionApiItem>(data));
        setPermissions((prev) => prev.map((p) => (p._id === editing._id ? updated : p)));
      } else {
        const { data } = await AdminContentApi.createTeamPermission(form);
        const created = mapTeamPermission(getResponseData<TeamPermissionApiItem>(data));
        setPermissions((prev) => [created, ...prev]);
      }
      setEditing(null);
      setForm(emptyForm);
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
    setForm(emptyForm);
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

      <Table columns={columns} data={filtered} loading={loading} />

      <Modal
        open={editing !== null || form.permission.length > 0}
        title={editing ? "Edit permission" : "New permission"}
        primaryLabel={editing ? "Save changes" : "Create permission"}
        onPrimary={handleSave}
        onClose={() => {
          setEditing(null);
          setForm(emptyForm);
        }}
        loading={saving}
      >
        <div className="space-y-3">
          <div className="inputContainer">
            <label htmlFor="perm-name">Permission name</label>
            <input
              id="perm-name"
              value={form.permission}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, permission: e.target.value }))
              }
              placeholder="e.g., manage_users"
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="perm-description">Description</label>
            <textarea
              id="perm-description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
              placeholder="Describe what this permission allows…"
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
          Are you sure you want to delete this permission? This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}
