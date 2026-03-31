import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AdminContentApi } from '../../api/adminContent';
import PageHeader from '../../common/page-header';
import TextInput from '../../common/text-input';
import { getResponseResource } from '../../functions/api-response';
import {
  sendCatchFeedback,
  sendSuccessFeedback,
} from '../../functions/feedback';
import { updateContentSchema, type UpdateContentFormData } from '../../schemas';
import type { SystemContentItem } from '../../types';

export function meta() {
  return [
    { title: 'Community guidelines | Testimonies Admin' },
    {
      name: 'description',
      content: 'Manage the community guidelines content.',
    },
  ];
}

export default function CommunityGuidelinesPage() {
  const [content, setContent] = useState<SystemContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateContentFormData>({
    resolver: zodResolver(updateContentSchema),
    defaultValues: {
      title: '',
      content: '',
      version: '',
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminContentApi.getCommunityGuidelines();
        const nextContent = getResponseResource<SystemContentItem>(
          data,
          'content',
        );
        if (!nextContent) {
          return;
        }
        setContent(nextContent);
        reset({
          title: nextContent.title,
          content: nextContent.content,
          version: nextContent.version || '',
        });
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reset]);

  const onSubmit = async (data: UpdateContentFormData) => {
    try {
      const { data: response } =
        await AdminContentApi.updateCommunityGuidelines({
          title: data.title,
          content: data.content,
          version: data.version || undefined,
        });
      setContent(getResponseResource<SystemContentItem>(response, 'content'));
      sendSuccessFeedback('Community guidelines updated successfully');
    } catch (error) {
      sendCatchFeedback(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Community guidelines"
        description="Update the community guidelines displayed to users."
        actions={
          <button
            type="submit"
            form="cg-form"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </button>
        }
      />

      <div className="card">
        <form id="cg-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <TextInput
              id="cg-title"
              label="Title"
              type="text"
              {...register('title')}
              error={errors.title?.message}
            />
            <TextInput
              id="cg-version"
              label="Version (optional)"
              type="text"
              {...register('version')}
              error={errors.version?.message}
              placeholder="e.g., 1.0.0"
            />
            <div className="inputContainer">
              <label htmlFor="cg-content">Content</label>
              <textarea
                id="cg-content"
                {...register('content')}
                rows={20}
                className="font-mono text-xs"
              />
              {errors.content && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.content.message}
                </p>
              )}
            </div>
            {content && (
              <div className="text-xs text-gray-500">
                Last updated: {new Date(content.updatedAt).toLocaleString()}
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
