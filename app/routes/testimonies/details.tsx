import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AdminTestimoniesApi } from '../../api/adminTestimonies';
import Modal from '../../common/modal';
import PageHeader from '../../common/page-header';
import { getResponseResource } from '../../functions/api-response';
import { sendCatchFeedback } from '../../functions/feedback';
import type { AdminTestimonySummary } from '../../types';
import { RoutePaths } from '../route-paths';

export function meta() {
  return [
    { title: 'Testimony details | Testimonies Admin' },
    { name: 'description', content: 'View detailed testimony information.' },
  ];
}

export default function TestimonyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testimony, setTestimony] = useState<AdminTestimonySummary | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [flagAction, setFlagAction] = useState<'flag' | 'unflag' | null>(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getTestimonyText = (item: AdminTestimonySummary) =>
    item.description || item.content || item.title || '(No content)';

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const { data } = await AdminTestimoniesApi.getById(id);
        setTestimony(
          getResponseResource<AdminTestimonySummary>(data, 'testimony'),
        );
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleConfirm = async () => {
    if (!testimony || !flagAction) return;
    try {
      setSubmitting(true);
      if (flagAction === 'flag') {
        await AdminTestimoniesApi.flag(
          testimony._id,
          reason || 'Flagged by admin',
        );
        setTestimony({ ...testimony, isFlagged: true });
      } else {
        await AdminTestimoniesApi.unflag(testimony._id, reason);
        setTestimony({ ...testimony, isFlagged: false });
      }
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setSubmitting(false);
      setFlagAction(null);
      setReason('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!testimony) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-sm text-gray-600">Testimony not found</p>
        <button
          type="button"
          onClick={() => navigate(RoutePaths.TESTIMONIES)}
          className="mt-4 text-xs font-medium text-primary hover:underline"
        >
          Back to testimonies
        </button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Testimony details"
        description={`Posted on ${new Date(testimony.createdAt).toLocaleDateString()}`}
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(RoutePaths.TESTIMONIES)}
              className="text-xs font-medium text-gray-600 hover:underline"
            >
              ← Back to testimonies
            </button>
            <button
              type="button"
              onClick={() => {
                setFlagAction(testimony.isFlagged ? 'unflag' : 'flag');
                setReason('');
              }}
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary/90"
            >
              {testimony.isFlagged ? 'Unflag' : 'Flag'}
            </button>
          </div>
        }
      />

      <div className="card">
        <div className="space-y-6">
          <div>
            <label className="text-xs font-medium text-gray-500">Status</label>
            <div className="mt-1">
              {testimony.isFlagged ? (
                <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                  Flagged
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  Active
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">User ID</label>
            <p className="mt-1 font-mono text-sm text-gray-900">
              {testimony.userId}
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">Content</label>
            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
              {getTestimonyText(testimony)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-medium text-gray-500">
                Created at
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(testimony.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                Testimony ID
              </label>
              <p className="mt-1 font-mono text-xs text-gray-900">
                {testimony._id}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={flagAction !== null}
        title={flagAction === 'flag' ? 'Flag testimony' : 'Unflag testimony'}
        primaryLabel={flagAction === 'flag' ? 'Flag' : 'Unflag'}
        onPrimary={handleConfirm}
        onClose={() => {
          setFlagAction(null);
          setReason('');
        }}
        loading={submitting}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            {flagAction === 'flag'
              ? 'Provide a reason for flagging this testimony.'
              : 'Optionally provide a note for unflagging this testimony.'}
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Reason (optional for unflag)…"
          />
        </div>
      </Modal>
    </>
  );
}
