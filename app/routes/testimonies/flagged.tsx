import { useEffect, useMemo, useState } from "react";
import { AdminTestimoniesApi } from "../../api/adminTestimonies";
import FilterBar from "../../common/filter-bar";
import Modal from "../../common/modal";
import PageHeader from "../../common/page-header";
import { Table, type TableColumn } from "../../common/table";
import { sendCatchFeedback } from "../../functions/feedback";
import type { AdminTestimonySummary } from "../../types";

export function meta() {
  return [
    { title: "Flagged testimonies | Testimonies Admin" },
    { name: "description", content: "Review and manage flagged testimonies." },
  ];
}

export default function FlaggedTestimonies() {
  const [items, setItems] = useState<AdminTestimonySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminTestimoniesApi.listFlagged({ page: 1, limit: 100 });
        setItems(data.data);
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
    if (!query) return items;
    return items.filter((item) => item.content.toLowerCase().includes(query));
  }, [items, search]);

  const columns: TableColumn<AdminTestimonySummary>[] = [
    {
      id: "content",
      header: "Content",
      accessor: (item) => (
        <p className="line-clamp-2 max-w-xl text-sm text-gray-800">{item.content}</p>
      ),
    },
    {
      id: "user",
      header: "User ID",
      accessor: (item) => (
        <span className="text-xs font-mono text-gray-500">
          {item.userId.slice(0, 8)}…
        </span>
      ),
    },
    {
      id: "created",
      header: "Created",
      accessor: (item) => (
        <span className="text-xs text-gray-600">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      accessor: (item) => (
        <button
          type="button"
          onClick={() => {
            setSelectedId(item._id);
            setReason("");
          }}
          className="text-xs font-medium text-primary hover:underline"
        >
          Unflag
        </button>
      ),
      className: "text-right",
    },
  ];

  const handleConfirm = async () => {
    if (!selectedId) return;
    try {
      setSubmitting(true);
      await AdminTestimoniesApi.unflag(selectedId, reason);
      setItems((prev) => prev.filter((i) => i._id !== selectedId));
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setSubmitting(false);
      setSelectedId(null);
    }
  };

  const activeItem = selectedId ? items.find((i) => i._id === selectedId) : undefined;

  return (
    <>
      <PageHeader
        title="Flagged testimonies"
        description="Review testimonies that have been flagged for violating guidelines."
      />

      <FilterBar searchValue={search} onSearchChange={setSearch} />

      <Table columns={columns} data={filtered} loading={loading} />

      <Modal
        open={selectedId !== null}
        title="Unflag testimony"
        primaryLabel="Unflag"
        onPrimary={handleConfirm}
        onClose={() => {
          setSelectedId(null);
          setReason("");
        }}
        loading={submitting}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            Are you sure you want to unflag this testimony?
          </p>
          {activeItem && (
            <p className="rounded-md bg-gray-50 p-2 text-xs text-gray-600">
              {activeItem.content}
            </p>
          )}
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Optional note…"
          />
        </div>
      </Modal>
    </>
  );
}
