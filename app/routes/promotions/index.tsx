import { useEffect, useMemo, useState } from 'react';
import { AdminPromotionsApi } from '../../api/adminPromotions';
import FilterBar from '../../common/filter-bar';
import Modal from '../../common/modal';
import PageHeader from '../../common/page-header';
import { Table, type TableColumn } from '../../common/table';
import {
  getPaginatedResponse,
  getResponseData,
} from '../../functions/api-response';
import { sendCatchFeedback } from '../../functions/feedback';
import type {
  PromotionSummary,
  PromotionTargetAudience,
  PromotionType,
} from '../../types';

export function meta() {
  return [
    { title: 'Promotions | Testimonies Admin' },
    { name: 'description', content: 'Manage promotions and announcements.' },
  ];
}

type PromotionFormState = Pick<
  PromotionSummary,
  'title' | 'description' | 'type' | 'targetAudience' | 'startDate'
> & { endDate?: string };

const emptyForm: PromotionFormState = {
  title: '',
  description: '',
  type: 'announcement',
  targetAudience: 'all',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
};

export default function PromotionsIndex() {
  const [promotions, setPromotions] = useState<PromotionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<PromotionSummary | null>(null);
  const [form, setForm] = useState<PromotionFormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminPromotionsApi.list({ page: 1, limit: 50 });
        const { results } = getPaginatedResponse<PromotionSummary>(
          data,
          'promotions',
        );
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
    return promotions.filter(
      (promo) =>
        promo.title.toLowerCase().includes(query) ||
        promo.description.toLowerCase().includes(query),
    );
  }, [promotions, search]);

  const columns: TableColumn<PromotionSummary>[] = [
    {
      id: 'title',
      header: 'Promotion',
      accessor: (promo) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {promo.title}
          </span>
          <span className="text-xs text-gray-500 line-clamp-1">
            {promo.description}
          </span>
        </div>
      ),
    },
    {
      id: 'type',
      header: 'Type',
      accessor: (promo) => (
        <span className="text-xs capitalize text-gray-600">{promo.type}</span>
      ),
    },
    {
      id: 'audience',
      header: 'Audience',
      accessor: (promo) => (
        <span className="text-xs capitalize text-gray-600">
          {promo.targetAudience}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (promo) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            promo.isActive
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {promo.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      id: 'flagged',
      header: 'Flagged',
      accessor: (promo) =>
        promo.isFlagged ? (
          <span className="text-xs font-medium text-red-600">Yes</span>
        ) : (
          <span className="text-xs text-gray-500">No</span>
        ),
    },
    {
      id: 'actions',
      header: '',
      accessor: (promo) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="text-xs font-medium text-gray-600 hover:underline"
            onClick={() => {
              setEditing(promo);
              setForm({
                title: promo.title,
                description: promo.description,
                type: promo.type,
                targetAudience: promo.targetAudience,
                startDate: promo.startDate.split('T')[0],
                endDate: promo.endDate ? promo.endDate.split('T')[0] : '',
              });
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="text-xs font-medium text-primary hover:underline"
            onClick={() => handleToggleStatus(promo)}
          >
            {promo.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  const handleToggleStatus = async (promo: PromotionSummary) => {
    try {
      if (promo.isActive) {
        await AdminPromotionsApi.deactivate(promo._id);
      } else {
        await AdminPromotionsApi.activate(promo._id);
      }
      setPromotions((prev) =>
        prev.map((p) =>
          p._id === promo._id ? { ...p, isActive: !p.isActive } : p,
        ),
      );
    } catch (error) {
      sendCatchFeedback(error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (editing) {
        const { data } = await AdminPromotionsApi.update(editing._id, {
          ...form,
          endDate: form.endDate || undefined,
        } as PromotionSummary);
        const updatedPromotion = getResponseData<PromotionSummary>(data);
        setPromotions((prev) =>
          prev.map((p) => (p._id === editing._id ? updatedPromotion : p)),
        );
      } else {
        const { data } = await AdminPromotionsApi.create({
          ...form,
          endDate: form.endDate || undefined,
          isActive: true,
        } as PromotionSummary);
        const createdPromotion = getResponseData<PromotionSummary>(data);
        setPromotions((prev) => [createdPromotion, ...prev]);
      }
      setEditing(null);
      setForm(emptyForm);
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setSaving(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  return (
    <>
      <PageHeader
        title="Promotions"
        description="Create and manage promotions, offers, and announcements."
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary/90"
          >
            New promotion
          </button>
        }
      />

      <FilterBar searchValue={search} onSearchChange={setSearch} />

      <Table columns={columns} data={filtered} loading={loading} />

      <Modal
        open={editing !== null || form.title.length > 0}
        title={editing ? 'Edit promotion' : 'New promotion'}
        primaryLabel={editing ? 'Save changes' : 'Create promotion'}
        onPrimary={handleSave}
        onClose={() => {
          setEditing(null);
          setForm(emptyForm);
        }}
        loading={saving}
      >
        <div className="space-y-3">
          <div className="inputContainer">
            <label htmlFor="promo-title">Title</label>
            <input
              id="promo-title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="promo-description">Description</label>
            <textarea
              id="promo-description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="inputContainer">
              <label htmlFor="promo-type">Type</label>
              <select
                id="promo-type"
                value={form.type}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    type: e.target.value as PromotionType,
                  }))
                }
              >
                <option value="announcement">Announcement</option>
                <option value="discount">Discount</option>
                <option value="offer">Offer</option>
                <option value="feature">Feature</option>
              </select>
            </div>
            <div className="inputContainer">
              <label htmlFor="promo-audience">Target audience</label>
              <select
                id="promo-audience"
                value={form.targetAudience}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    targetAudience: e.target.value as PromotionTargetAudience,
                  }))
                }
              >
                <option value="all">All</option>
                <option value="premium">Premium</option>
                <option value="basic">Basic</option>
                <option value="organizations">Organizations</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="inputContainer">
              <label htmlFor="promo-start">Start date</label>
              <input
                id="promo-start"
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />
            </div>
            <div className="inputContainer">
              <label htmlFor="promo-end">End date (optional)</label>
              <input
                id="promo-end"
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
