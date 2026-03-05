import { useEffect, useMemo, useState } from 'react';
import { AdminTestimoniesApi } from '../../api/adminTestimonies';
import PageHeader from '../../common/page-header';
import FilterBar from '../../common/filter-bar';
import PaginationControls from '../../common/pagination-controls';
import { Table, type TableColumn } from '../../common/table';
import SelectInput from '../../common/select-input';
import { getPaginatedResponse } from '../../functions/api-response';
import type { AdminTestimonySummary, PaginationMeta } from '../../types';
import { sendCatchFeedback } from '../../functions/feedback';
import Modal from '../../common/modal';

export function meta() {
  return [
    { title: 'Testimonies | Testimonies Admin' },
    { name: 'description', content: 'Review and moderate user testimonies.' },
  ];
}

export default function TestimoniesIndex() {
  const [items, setItems] = useState<AdminTestimonySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [flagAction, setFlagAction] = useState<'flag' | 'unflag' | null>(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    totalResults: 0,
    resultsPerPage: 20,
    totalPages: 1,
    currentPage: 1,
    prevPage: null,
    nextPage: null,
  });
  const [isFlaggedFilter, setIsFlaggedFilter] = useState<
    'all' | 'true' | 'false'
  >('all');

  const getTestimonyText = (item: AdminTestimonySummary) =>
    item.description || item.content || item.title || '(No content)';

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminTestimoniesApi.list({
          page,
          limit: 20,
          isFlagged:
            isFlaggedFilter === 'all' ? undefined : isFlaggedFilter === 'true',
        });
        const { results, pagination: pageMeta } =
          getPaginatedResponse<AdminTestimonySummary>(data, 'testimonies');
        setItems(results);
        setPagination(pageMeta);
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, isFlaggedFilter]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) =>
      getTestimonyText(item).toLowerCase().includes(query),
    );
  }, [items, search]);

  const columns: TableColumn<AdminTestimonySummary>[] = [
    {
      id: 'content',
      header: 'Content',
      accessor: (item) => (
        <p className="line-clamp-2 max-w-xl text-sm text-gray-800">
          {getTestimonyText(item)}
        </p>
      ),
    },
    {
      id: 'user',
      header: 'User ID',
      accessor: (item) => (
        <span className="text-xs font-mono text-gray-500">
          {item.userId.slice(0, 8)}…
        </span>
      ),
    },
    {
      id: 'flag',
      header: 'Flagged',
      accessor: (item) =>
        item.isFlagged ? (
          <span className="text-xs font-medium text-red-600">Yes</span>
        ) : (
          <span className="text-xs text-gray-500">No</span>
        ),
    },
    {
      id: 'actions',
      header: '',
      accessor: (item) => (
        <button
          type="button"
          onClick={() => {
            setSelectedId(item._id);
            setFlagAction(item.isFlagged ? 'unflag' : 'flag');
            setReason('');
          }}
          className="text-xs font-medium text-primary hover:underline"
        >
          {item.isFlagged ? 'Unflag' : 'Flag'}
        </button>
      ),
      className: 'text-right',
    },
  ];

  const handleConfirm = async () => {
    if (!selectedId || !flagAction) return;
    try {
      setSubmitting(true);
      if (flagAction === 'flag') {
        await AdminTestimoniesApi.flag(
          selectedId,
          reason || 'Flagged by admin',
        );
        setItems((prev) =>
          prev.map((i) =>
            i._id === selectedId ? { ...i, isFlagged: true } : i,
          ),
        );
      } else {
        await AdminTestimoniesApi.unflag(selectedId, reason);
        setItems((prev) =>
          prev.map((i) =>
            i._id === selectedId ? { ...i, isFlagged: false } : i,
          ),
        );
      }
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setSubmitting(false);
      setSelectedId(null);
      setFlagAction(null);
    }
  };

  const activeItem = selectedId
    ? items.find((i) => i._id === selectedId)
    : undefined;

  return (
    <>
      <PageHeader
        title="Testimonies"
        description="Browse, review and flag testimonies that violate community guidelines."
      />

      <FilterBar searchValue={search} onSearchChange={setSearch}>
        <SelectInput
          value={isFlaggedFilter}
          onChange={(value) => {
            setIsFlaggedFilter(value as 'all' | 'true' | 'false');
            setPage(1);
          }}
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'true', label: 'Flagged only' },
            { value: 'false', label: 'Unflagged only' },
          ]}
        />
      </FilterBar>

      <Table
        columns={columns}
        data={filtered}
        loading={loading}
        getRowKey={(item) => item._id}
        mobileTitle={(item) => getTestimonyText(item)}
        mobileSubtitle={(item) => `User: ${item.userId}`}
        mobileActions={(item) => (
          <button
            type="button"
            onClick={() => {
              setSelectedId(item._id);
              setFlagAction(item.isFlagged ? 'unflag' : 'flag');
              setReason('');
            }}
            className="text-xs font-medium text-primary hover:underline"
          >
            {item.isFlagged ? 'Unflag' : 'Flag'}
          </button>
        )}
      />
      <PaginationControls
        page={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalResults={pagination.totalResults}
        onPageChange={setPage}
      />

      <Modal
        open={selectedId !== null && flagAction !== null}
        title={flagAction === 'flag' ? 'Flag testimony' : 'Unflag testimony'}
        primaryLabel={flagAction === 'flag' ? 'Flag' : 'Unflag'}
        onPrimary={handleConfirm}
        onClose={() => {
          setSelectedId(null);
          setFlagAction(null);
        }}
        loading={submitting}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            {flagAction === 'flag'
              ? 'Provide a reason for flagging this testimony. This helps with audit trails.'
              : 'Optionally provide a note for unflagging this testimony.'}
          </p>
          {activeItem && (
            <p className="rounded-md bg-gray-50 p-2 text-xs text-gray-600">
              {getTestimonyText(activeItem)}
            </p>
          )}
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Reason (optional for unflag)…"
          />
        </div>
      </Modal>
    </>
  );
}
