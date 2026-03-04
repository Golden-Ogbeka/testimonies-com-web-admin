import { useEffect, useState } from "react";
import { AdminSubscriptionsApi } from "../../api/adminSubscriptions";
import Modal from "../../common/modal";
import PageHeader from "../../common/page-header";
import { Table, type TableColumn } from "../../common/table";
import { sendCatchFeedback } from "../../functions/feedback";
import type { SubscriptionPlan } from "../../types";

export function meta() {
  return [
    { title: "Subscription plans | Testimonies Admin" },
    { name: "description", content: "Configure subscription plans for the platform." },
  ];
}

type PlanFormState = Pick<
  SubscriptionPlan,
  "name" | "description" | "price" | "billingCycle"
> & { currency: string };

const emptyForm: PlanFormState = {
  name: "",
  description: "",
  price: 0,
  billingCycle: "monthly",
  currency: "NGN",
};

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SubscriptionPlan | null>(null);
  const [form, setForm] = useState<PlanFormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminSubscriptionsApi.listPlans({ page: 1, limit: 50 });
        setPlans(data.data);
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const columns: TableColumn<SubscriptionPlan>[] = [
    {
      id: "name",
      header: "Plan",
      accessor: (plan) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{plan.name}</span>
          <span className="text-xs text-gray-500">
            {plan.billingCycle.charAt(0).toUpperCase() + plan.billingCycle.slice(1)}
          </span>
        </div>
      ),
    },
    {
      id: "price",
      header: "Price",
      accessor: (plan) => (
        <span className="text-sm text-gray-900">
          {plan.currency} {plan.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessor: (plan) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            plan.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          {plan.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      accessor: (plan) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="text-xs font-medium text-gray-600 hover:underline"
            onClick={() => {
              setEditing(plan);
              setForm({
                name: plan.name,
                description: plan.description,
                price: plan.price,
                billingCycle: plan.billingCycle,
                currency: plan.currency,
              });
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="text-xs font-medium text-primary hover:underline"
            onClick={() => handleToggleStatus(plan)}
          >
            {plan.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      ),
      className: "text-right",
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
        prev.map((p) => (p._id === plan._id ? { ...p, isActive: !p.isActive } : p)),
      );
    } catch (error) {
      sendCatchFeedback(error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (editing) {
        const { data } = await AdminSubscriptionsApi.updatePlan(editing._id, {
          name: form.name,
          description: form.description,
          price: form.price,
          billingCycle: form.billingCycle,
          currency: form.currency,
        } as SubscriptionPlan);
        setPlans((prev) =>
          prev.map((p) => (p._id === editing._id ? data.data : p)),
        );
      } else {
        const { data } = await AdminSubscriptionsApi.createPlan({
          name: form.name,
          description: form.description,
          price: form.price,
          billingCycle: form.billingCycle,
          currency: form.currency,
          features: [],
        });
        setPlans((prev) => [data.data, ...prev]);
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

      <Table columns={columns} data={plans} loading={loading} />

      <Modal
        open={editing !== null || form.name.length > 0}
        title={editing ? "Edit plan" : "New plan"}
        primaryLabel={editing ? "Save changes" : "Create plan"}
        onPrimary={handleSave}
        onClose={() => {
          setEditing(null);
          setForm(emptyForm);
        }}
        loading={saving}
      >
        <div className="space-y-3">
          <div className="inputContainer">
            <label htmlFor="plan-name">Name</label>
            <input
              id="plan-name"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="plan-description">Description</label>
            <textarea
              id="plan-description"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="inputContainer">
              <label htmlFor="plan-price">Price</label>
              <input
                id="plan-price"
                type="number"
                value={form.price}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    price: Number(event.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="inputContainer">
              <label htmlFor="plan-cycle">Billing cycle</label>
              <select
                id="plan-cycle"
                value={form.billingCycle}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    billingCycle: event.target.value as PlanFormState["billingCycle"],
                  }))
                }
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

