import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AdminPromotionsApi } from '../../api/adminPromotions';
import FilterBar from '../../common/filter-bar';
import Modal from '../../common/modal';
import PaginationControls from '../../common/pagination-controls';
import PageHeader from '../../common/page-header';
import SelectInput from '../../common/select-input';
import { Table, type TableColumn } from '../../common/table';
import {
  getPaginatedResponse,
  getResponseResource,
} from '../../functions/api-response';
import { sendCatchFeedback } from '../../functions/feedback';
import {
  createPromotionSchema,
  type CreatePromotionFormData,
} from '../../schemas';
import type {
  PaginationMeta,
  PromotionSummary,
  PromotionType,
} from '../../types';

export function meta() {
  return [
    { title: 'Promotions | Testimonies Admin' },
    { name: 'description', content: 'Manage promotions and announcements.' },
  ];
}

export default function PromotionsIndex() {
  const [promotions, setPromotions] = useState<PromotionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<PromotionSummary | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');
  const [flagFilter, setFlagFilter] = useState<'all' | 'flagged' | 'clean'>(
    'all',
  );
  const [typeFilter, setTypeFilter] = useState<'all' | PromotionType>('all');
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
  } = useForm<CreatePromotionFormData>({
    resolver: zodResolver(createPromotionSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'announcement',
      targetAudience: 'all',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminPromotionsApi.list({
          page,
          limit: 20,
          isActive:
            statusFilter === 'all' ? undefined : statusFilter === 'active',
          isFlagged:
            flagFilter === 'all' ? undefined : flagFilter === 'flagged',
          type: typeFilter === 'all' ? undefined : typeFilter,
        });
        const { results, pagination: pageMeta } =
          getPaginatedResponse<PromotionSummary>(data, 'promotions');
        setPromotions(results);
        setPagination(pageMeta);
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, statusFilter, flagFilter, typeFilter]);

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
            onClick={() => openEdit(promo)}
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

  const openEdit = (promo: PromotionSummary) => {
    setEditing(promo);
    reset({
      title: promo.title,
      description: promo.description,
      type: promo.type,
      targetAudience: promo.targetAudience,
      startDate: promo.startDate.split('T')[0],
      endDate: promo.endDate ? promo.endDate.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditing(null);
    reset({
      title: '',
      description: '',
      type: 'announcement',
      targetAudience: 'all',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
    setShowModal(true);
  };

  const onSave = async (data: CreatePromotionFormData) => {
    try {
      if (editing) {
        const { data: response } = await AdminPromotionsApi.update(
          editing._id,
          {
            ...data,
            endDate: data.endDate || undefined,
          } as PromotionSummary,
        );
        const updatedPromotion = getResponseResource<PromotionSummary>(
          response,
          'promotion',
        );
        setPromotions((prev) =>
          prev.map((p) => (p._id === editing._id ? updatedPromotion : p)),
        );
      } else {
        const { data: response } = await AdminPromotionsApi.create({
          ...data,
          endDate: data.endDate || undefined,
          isActive: true,
        } as PromotionSummary);
        const createdPromotion = getResponseResource<PromotionSummary>(
          response,
          'promotion',
        );
        setPromotions((prev) => [createdPromotion, ...prev]);
      }
      setEditing(null);
      setShowModal(false);
      reset();
    } catch (error) {
      sendCatchFeedback(error);
    }
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

      <FilterBar searchValue={search} onSearchChange={setSearch}>
        <SelectInput
          value={typeFilter}
          onChange={(value) => {
            setTypeFilter(value as 'all' | PromotionType);
            setPage(1);
          }}
          options={[
            { value: 'all', label: 'All types' },
            { value: 'announcement', label: 'Announcement' },
            { value: 'discount', label: 'Discount' },
            { value: 'offer', label: 'Offer' },
            { value: 'feature', label: 'Feature' },
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
        <SelectInput
          value={flagFilter}
          onChange={(value) => {
            setFlagFilter(value as 'all' | 'flagged' | 'clean');
            setPage(1);
          }}
          options={[
            { value: 'all', label: 'All flags' },
            { value: 'flagged', label: 'Flagged' },
            { value: 'clean', label: 'Not flagged' },
          ]}
        />
      </FilterBar>

      <Table
        columns={columns}
        data={filtered}
        loading={loading}
        getRowKey={(promo) => promo._id}
        mobileTitle={(promo) => promo.title}
        mobileSubtitle={(promo) => promo.description}
        mobileActions={(promo) => (
          <div className="flex gap-3">
            <button
              type="button"
              className="text-xs font-medium text-gray-600 hover:underline"
              onClick={() => openEdit(promo)}
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
        title={editing ? 'Edit promotion' : 'New promotion'}
        primaryLabel={editing ? 'Save changes' : 'Create promotion'}
        onPrimary={handleSubmit(onSave)}
        onClose={() => {
          setEditing(null);
          setShowModal(false);
          reset();
        }}
        loading={isSubmitting}
      >
        <div className="space-y-3">
          <div className="inputContainer">
            <label htmlFor="promo-title">Title</label>
            <input id="promo-title" {...register('title')} />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="inputContainer">
            <label htmlFor="promo-description">Description</label>
            <textarea
              id="promo-description"
              {...register('description')}
              rows={3}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="inputContainer">
              <label htmlFor="promo-type">Type</label>
              <select id="promo-type" {...register('type')}>
                <option value="announcement">Announcement</option>
                <option value="discount">Discount</option>
                <option value="offer">Offer</option>
                <option value="feature">Feature</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.type.message}
                </p>
              )}
            </div>
            <div className="inputContainer">
              <label htmlFor="promo-audience">Target audience</label>
              <select id="promo-audience" {...register('targetAudience')}>
                <option value="all">All</option>
                <option value="premium">Premium</option>
                <option value="basic">Basic</option>
                <option value="organizations">Organizations</option>
              </select>
              {errors.targetAudience && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.targetAudience.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="inputContainer">
              <label htmlFor="promo-start">Start date</label>
              <input id="promo-start" type="date" {...register('startDate')} />
              {errors.startDate && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div className="inputContainer">
              <label htmlFor="promo-end">End date (optional)</label>
              <input id="promo-end" type="date" {...register('endDate')} />
              {errors.endDate && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
