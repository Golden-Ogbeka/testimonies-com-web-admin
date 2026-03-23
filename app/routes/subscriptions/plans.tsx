import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AdminSubscriptionsApi } from '../../api/adminSubscriptions';
import Modal from '../../common/modal';
import PaginationControls from '../../common/pagination-controls';
import PageHeader from '../../common/page-header';
import SelectInput from '../../common/select-input';
import { Table, type TableColumn } from '../../common/table';
import { getPaginatedResponse } from '../../functions/api-response';
import { sendCatchFeedback } from '../../functions/feedback';
import {
  createSubscriptionPlanSchema,
  type CreateSubscriptionPlanFormData,
} from '../../schemas';
import type { PaginationMeta, SubscriptionPlan } from '../../types';

export function meta() {
  return [
    { title: 'Subscription plans | Testimonies Admin' },
    {
      name: 'description',
      content: 'Configure subscription plans for the platform.',
    },
  ];
}

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SubscriptionPlan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');
  const [cycleFilter, setCycleFilter] = useState<
    'all' | 'monthly' | 'yearly' | 'quarterly'
  >('all');
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
  } = useForm<CreateSubscriptionPlanFormData>({
    resolver: zodResolver(createSubscriptionPlanSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      billingCycle: 'monthly',
      currency: 'NGN',
      features: [],
      isActive: true,
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminSubscriptionsApi.listPlans({
          page,
          limit: 20,
          isActive:
            statusFilter === 'all' ? undefined : statusFilter === 'active',
          billingCycle: cycleFilter === 'all' ? undefined : cycleFilter,
        });
        const { results, pagination: pageMeta } =
          getPaginatedResponse<SubscriptionPlan>(data, 'plans');
        setPlans(results);
        setPagination(pageMeta);
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, statusFilter, cycleFilter]);

  const columns: TableColumn<SubscriptionPlan>[] = [
    {
      id: 'name',
      header: 'Plan',
      accessor: (plan) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{plan.name}</span>
          <span className="text-xs text-gray-500">
            {plan.billingCycle.charAt(0).toUpperCase() +
              plan.billingCycle.slice(1)}
          </span>
        </div>
      ),
    },
    {
      id: 'price',
      header: 'Price',
      accessor: (plan) => (
        <span className="text-sm text-gray-900">
          {plan.currency}{' '}
          {plan.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (plan) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            plan.isActive
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {plan.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      accessor: (plan) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="text-xs font-medium text-gray-600 hover:underline"
            onClick={() => openEdit(plan)}
          >
            Edit
          </button>
          <button
            type="button"
            className="text-xs font-medium text-primary hover:underline"
            onClick={() => handleToggleStatus(plan)}
          >
            {plan.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  const handleToggleStatus = async (plan: SubscriptionPlan) => {
    try {
      if (plan.isActive) {
        await AdminSubscriptionsApi.deactivatePlan(plan._id);
      } else {
        await AdminSubscriptionsApi.activatePlan(plan._id);
      }
      setPlans((prev) =>
        prev.map((p) =>
          p._id === plan._id ? { ...p, isActive: !p.isActive } : p,
        ),
      );
    } catch (error) {
      sendCatchFeedback(error);
    }
  };

  const openEdit = (plan: SubscriptionPlan) => {
    setEditing(plan);
    reset({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      billingCycle: plan.billingCycle,
      currency: plan.currency,
      features: [],
    });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditing(null);
    reset({
      name: '',
      description: '',
      price: 0,
      billingCycle: 'monthly',
      currency: 'NGN',
      features: [],
    });
    setShowModal(true);
  };

  const onSave = async (data: CreateSubscriptionPlanFormData) => {
    try {
      if (editing) {
        const { data: response } = await AdminSubscriptionsApi.updatePlan(
          editing._id,
          data as SubscriptionPlan,
        );
        setPlans((prev) =>
          prev.map((p) => (p._id === editing._id ? response.data : p)),
        );
      } else {
        const { data: response } = await AdminSubscriptionsApi.createPlan({
          ...data,
          features: data.features ?? [],
        });
        setPlans((prev) => [response.data, ...prev]);
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
        title="Subscription plans"
        description="Manage the plans available to Testimonies users."
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary/90"
          >
            New plan
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
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
          value={cycleFilter}
          onChange={(value) => {
            setCycleFilter(value as 'all' | 'monthly' | 'yearly' | 'quarterly');
            setPage(1);
          }}
          options={[
            { value: 'all', label: 'All billing cycles' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'quarterly', label: 'Quarterly' },
            { value: 'yearly', label: 'Yearly' },
          ]}
        />
      </div>

      <Table
        columns={columns}
        data={plans}
        loading={loading}
        getRowKey={(plan) => plan._id}
        mobileTitle={(plan) => plan.name}
        mobileSubtitle={(plan) =>
          `${plan.currency} ${plan.price.toLocaleString()} • ${plan.billingCycle}`
        }
        mobileActions={(plan) => (
          <div className="flex gap-3">
            <button
              type="button"
              className="text-xs font-medium text-gray-600 hover:underline"
              onClick={() => openEdit(plan)}
            >
              Edit
            </button>
            <button
              type="button"
              className="text-xs font-medium text-primary hover:underline"
              onClick={() => handleToggleStatus(plan)}
            >
              {plan.isActive ? 'Deactivate' : 'Activate'}
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
        title={editing ? 'Edit plan' : 'New plan'}
        primaryLabel={editing ? 'Save changes' : 'Create plan'}
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
            <label htmlFor="plan-name">Name</label>
            <input id="plan-name" {...register('name')} />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div className="inputContainer">
            <label htmlFor="plan-description">Description</label>
            <textarea
              id="plan-description"
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
              <label htmlFor="plan-price">Price</label>
              <input
                id="plan-price"
                type="number"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div className="inputContainer">
              <label htmlFor="plan-currency">Currency</label>
              <input
                id="plan-currency"
                {...register('currency')}
                placeholder="NGN"
              />
              {errors.currency && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.currency.message}
                </p>
              )}
            </div>
          </div>
          <div className="inputContainer">
            <label htmlFor="plan-cycle">Billing cycle</label>
            <select id="plan-cycle" {...register('billingCycle')}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="quarterly">Quarterly</option>
            </select>
            {errors.billingCycle && (
              <p className="mt-1 text-xs text-red-600">
                {errors.billingCycle.message}
              </p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
