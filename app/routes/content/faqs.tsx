import { useEffect, useState } from 'react';
import { AdminContentApi } from '../../api/adminContent';
import FilterBar from '../../common/filter-bar';
import Modal from '../../common/modal';
import PageHeader from '../../common/page-header';
import { Table, type TableColumn } from '../../common/table';
import {
  getPaginatedResponse,
  getResponseData,
} from '../../functions/api-response';
import {
  sendCatchFeedback,
  sendSuccessFeedback,
} from '../../functions/feedback';
import type { FaqItem } from '../../types';

export function meta() {
  return [
    { title: 'FAQs | Testimonies Admin' },
    { name: 'description', content: 'Manage frequently asked questions.' },
  ];
}

type FaqFormState = Pick<FaqItem, 'question' | 'answer' | 'order'>;

const emptyForm: FaqFormState = {
  question: '',
  answer: '',
  order: 0,
};

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [form, setForm] = useState<FaqFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>(
    'all',
  );

  const loadFaqs = async (currentPage = 1) => {
    try {
      setLoading(true);
      const { data } = await AdminContentApi.listFaq({
        page: currentPage,
        limit: 20,
        isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
      });

      const { results, pagination } = getPaginatedResponse<FaqItem>(
        data,
        'faqs',
      );
      setFaqs(results);
      setTotalPages(pagination.totalPages || 1);
      setTotalResults(pagination.totalResults || 0);
      setPage(pagination.currentPage || currentPage);
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs(1);
  }, [statusFilter]);

  const columns: TableColumn<FaqItem>[] = [
    {
      id: 'order',
      header: 'Order',
      accessor: (faq) => (
        <span className="text-xs font-medium text-gray-600">{faq.order}</span>
      ),
      className: 'w-16',
    },
    {
      id: 'question',
      header: 'Question',
      accessor: (faq) => (
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-sm font-medium text-gray-900 break-words">
            {faq.question}
          </span>
          <span className="text-xs text-gray-500 line-clamp-2 break-words">
            {faq.answer}
          </span>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (faq) => (
        <button
          type="button"
          onClick={() => handleToggleStatus(faq)}
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
            faq.isActive
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {faq.isActive ? 'Active' : 'Inactive'}
        </button>
      ),
      className: 'w-24',
    },
    {
      id: 'actions',
      header: '',
      accessor: (faq) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="text-xs font-medium text-primary hover:underline"
            onClick={() => {
              setEditing(faq);
              setForm({
                question: faq.question,
                answer: faq.answer,
                order: faq.order,
              });
              setShowModal(true);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="text-xs font-medium text-red-600 hover:underline"
            onClick={() => setDeleteId(faq._id)}
          >
            Delete
          </button>
        </div>
      ),
      className: 'w-24 text-right',
    },
  ];

  const handleToggleStatus = async (faq: FaqItem) => {
    try {
      const { data } = await AdminContentApi.toggleFaqStatus(
        faq._id,
        !faq.isActive,
      );
      const updatedFaq = getResponseData<FaqItem>(data);
      setFaqs((prev) => prev.map((f) => (f._id === faq._id ? updatedFaq : f)));
      sendSuccessFeedback(
        `FAQ ${!faq.isActive ? 'activated' : 'deactivated'} successfully`,
      );
    } catch (error) {
      sendCatchFeedback(error);
    }
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      sendCatchFeedback(new Error('Question and answer are required'));
      return;
    }

    try {
      setSaving(true);
      if (editing) {
        const { data } = await AdminContentApi.updateFaq(editing._id, form);
        const updatedFaq = getResponseData<FaqItem>(data);
        setFaqs((prev) =>
          prev.map((f) => (f._id === editing._id ? updatedFaq : f)),
        );
        sendSuccessFeedback('FAQ updated successfully');
      } else {
        await AdminContentApi.createFaq(form);
        sendSuccessFeedback('FAQ created successfully');
        loadFaqs(1); // Reload to get updated list
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
      await AdminContentApi.deleteFaq(deleteId);
      sendSuccessFeedback('FAQ deleted successfully');

      // Reload current page or go to previous if current page becomes empty
      const remainingOnPage = faqs.length - 1;
      if (remainingOnPage === 0 && page > 1) {
        loadFaqs(page - 1);
      } else {
        loadFaqs(page);
      }
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
    setShowModal(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      loadFaqs(newPage);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="FAQs"
        description="Manage frequently asked questions displayed to users."
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 whitespace-nowrap"
          >
            + New FAQ
          </button>
        }
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search FAQs..."
      >
        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value as 'all' | 'active' | 'inactive');
            setPage(1);
          }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </FilterBar>

      <Table
        columns={columns}
        data={faqs}
        loading={loading}
        emptyMessage="No FAQs found"
        getRowKey={(faq) => faq._id}
        mobileTitle={(faq) => faq.question}
        mobileSubtitle={(faq) => faq.answer}
        mobileActions={(faq) => (
          <div className="flex gap-3">
            <button
              type="button"
              className="text-xs font-medium text-gray-600 hover:underline"
              onClick={() => {
                setEditing(faq);
                setForm({
                  question: faq.question,
                  answer: faq.answer,
                  order: faq.order,
                });
                setShowModal(true);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              className="text-xs font-medium text-red-600 hover:underline"
              onClick={() => setDeleteId(faq._id)}
            >
              Delete
            </button>
          </div>
        )}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{faqs.length}</span> of{' '}
            <span className="font-medium">{totalResults}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={showModal}
        title={editing ? 'Edit FAQ' : 'New FAQ'}
        primaryLabel={editing ? 'Save changes' : 'Create FAQ'}
        onPrimary={handleSave}
        onClose={() => {
          setEditing(null);
          setForm(emptyForm);
          setShowModal(false);
        }}
        loading={saving}
      >
        <div className="space-y-4">
          <div className="inputContainer">
            <label htmlFor="faq-question">Question</label>
            <input
              id="faq-question"
              value={form.question}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, question: e.target.value }))
              }
              placeholder="Enter the question"
              className="w-full"
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="faq-answer">Answer</label>
            <textarea
              id="faq-answer"
              value={form.answer}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, answer: e.target.value }))
              }
              rows={5}
              placeholder="Enter the answer"
              className="w-full resize-none"
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="faq-order">Display order</label>
            <input
              id="faq-order"
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  order: Number(e.target.value) || 0,
                }))
              }
              placeholder="0"
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              Lower numbers appear first
            </p>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteId !== null}
        title="Delete FAQ"
        primaryLabel="Delete"
        onPrimary={handleDelete}
        onClose={() => setDeleteId(null)}
        loading={deleting}
      >
        <p className="text-sm text-gray-700">
          Are you sure you want to delete this FAQ? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}
