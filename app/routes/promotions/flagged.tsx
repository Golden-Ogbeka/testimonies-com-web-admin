import { useEffect, useMemo, useState } from "react";
import { AdminPromotionsApi } from "../../api/adminPromotions";
import FilterBar from "../../common/filter-bar";
import Modal from "../../common/modal";
import PageHeader from "../../common/page-header";
import { Table, type TableColumn } from "../../common/table";
import { getPaginatedResponse } from "../../functions/api-response";
import { sendCatchFeedback } from "../../functions/feedback";
import type { PromotionSummary } from "../../types";

export function meta() {
  return [
    { title: "Flagged promotions | Testimonies Admin" },
    { name: "description", content: "Review and manage flagged promotions." },
  ];
}

export default function FlaggedPromotions() {
  const [promotions, setPromotions] = useState<PromotionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminPromotionsApi.listFlagged({ page: 1, limit: 50 });
        const { results } = getPaginatedResponse<PromotionSummary>(data, "promotions");
        setPromotions(results);
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
    if (!query) return promotions;
    return promotions.filter((promo) =>
      promo.title.toLowerCase().includes(query) ||
      promo.description.toLowerCase().includes(query)
    );
  }, [promotions, search]);

  const columns: TableColumn<PromotionSummary>[] = [
    {
      id: "title",
      header: "Promotion",
      accessor: (promo) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{promo.title}</span>
          <span className="text-xs text-gray-500 line-clamp-1">{promo.description}</span>
        </div>
      ),
    },
    {
      id: "type",
      header: "Type",
      accessor: (promo) => (
        <span className="text-xs capitalize text-gray-600">{promo.type}</span>
      ),
    },
    {
      id: "reason",
      header: "Flag reason",
      accessor: (promo) => (
        <span className="text-xs text-gray-600">{promo.flagReason || "—"}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessor: (promo) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            promo.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          {promo.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      accessor: (promo) => (
        <button
          type="button"
          onClick={() => setSelectedId(promo._id)}
          className="text-xs font-medium text-primary hover:underline"
        >
          Unflag
        </button>
      ),
      className: "text-right",
    },
  ];

  const handleUnflag = async () => {
    if (!selectedId) return;
    try {
      setSubmitting(true);
      await AdminPromotionsApi.unflag(selectedId);
      setPromotions((prev) => prev.filter((p) => p._id !== selectedId));
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setSubmitting(false);
      setSelectedId(null);
    }
  };

  const activePromo = selectedId
    ? promotions.find((p) => p._id === selectedId)
    : undefined;

  return (
    <>
      <PageHeader
        title="Flagged promotions"
        description="Review promotions that have been flagged for review."
      />

      <FilterBar searchValue={search} onSearchChange={setSearch} />

      <Table columns={columns} data={filtered} loading={loading} />

      <Modal
        open={selectedId !== null}
        title="Unflag promotion"
        primaryLabel="Unflag"
        onPrimary={handleUnflag}
        onClose={() => setSelectedId(null)}
        loading={submitting}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            Are you sure you want to unflag this promotion?
          </p>
          {activePromo && (
            <div className="rounded-md bg-gray-50 p-3 space-y-1">
              <p className="text-sm font-medium text-gray-900">{activePromo.title}</p>
              <p className="text-xs text-gray-600">{activePromo.description}</p>
              {activePromo.flagReason && (
                <p className="text-xs text-red-600 mt-2">
                  Reason: {activePromo.flagReason}
                </p>
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
