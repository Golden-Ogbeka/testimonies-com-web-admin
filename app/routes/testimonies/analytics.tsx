import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AdminTestimoniesApi } from '../../api/adminTestimonies';
import PageHeader from '../../common/page-header';
import { Table, type TableColumn } from '../../common/table';
import { getResponseResource } from '../../functions/api-response';
import { sendCatchFeedback } from '../../functions/feedback';
import type { AdminTestimonyAnalyticsItem } from '../../types';
import { RoutePaths } from '../route-paths';

export function meta() {
  return [
    { title: 'Testimony analytics | Testimonies Admin' },
    {
      name: 'description',
      content: 'View testimony engagement and performance metrics.',
    },
  ];
}

export default function TestimonyAnalytics() {
  const navigate = useNavigate();
  const [highestEngagement, setHighestEngagement] = useState<
    AdminTestimonyAnalyticsItem[]
  >([]);
  const [highestLikes, setHighestLikes] = useState<
    AdminTestimonyAnalyticsItem[]
  >([]);
  const [highestViews, setHighestViews] = useState<
    AdminTestimonyAnalyticsItem[]
  >([]);
  const [mostActiveUsers, setMostActiveUsers] = useState<
    AdminTestimonyAnalyticsItem[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [engagement, likes, views, active] = await Promise.all([
          AdminTestimoniesApi.analyticsHighestEngagement(10),
          AdminTestimoniesApi.analyticsHighestLikes(10),
          AdminTestimoniesApi.analyticsHighestViews(10),
          AdminTestimoniesApi.analyticsMostActiveUsers(10),
        ]);
        setHighestEngagement(
          getResponseResource<AdminTestimonyAnalyticsItem[]>(
            engagement.data,
            'testimonies',
          ),
        );
        setHighestLikes(
          getResponseResource<AdminTestimonyAnalyticsItem[]>(
            likes.data,
            'testimonies',
          ),
        );
        setHighestViews(
          getResponseResource<AdminTestimonyAnalyticsItem[]>(
            views.data,
            'testimonies',
          ),
        );
        setMostActiveUsers(
          getResponseResource<AdminTestimonyAnalyticsItem[]>(
            active.data,
            'users',
          ),
        );
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const testimonyColumns: TableColumn<AdminTestimonyAnalyticsItem>[] = [
    {
      id: 'testimony',
      header: 'Testimony',
      accessor: (item) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {item.title || 'Untitled'}
          </span>
        </div>
      ),
    },
    {
      id: 'count',
      header: 'Count',
      accessor: (item) => (
        <span className="text-sm font-semibold text-primary">{item.count}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      accessor: (item) => (
        <button
          type="button"
          onClick={() =>
            navigate(`${RoutePaths.TESTIMONY_DETAILS}/${item._id}`)
          }
          className="text-xs font-medium text-primary hover:underline"
        >
          View details
        </button>
      ),
      className: 'text-right',
    },
  ];

  const userColumns: TableColumn<AdminTestimonyAnalyticsItem>[] = [
    {
      id: 'user',
      header: 'User',
      accessor: (item) => (
        <span className="text-sm font-mono text-gray-900">
          {item.user?.accountType === 'organization'
            ? item.user?.businessName || item.user?.firstName
            : `${item.user?.firstName ?? ''} ${item.user?.lastName ?? ''}`.trim() ||
              item.user?.username ||
              item.user?._id}
        </span>
      ),
    },
    {
      id: 'count',
      header: 'Count',
      accessor: (item) => (
        <span className="text-sm font-semibold text-primary">{item.count}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      accessor: (item) => (
        <button
          type="button"
          onClick={() =>
            navigate(`${RoutePaths.USER_DETAILS}/${item.user?._id}`)
          }
          className="text-xs font-medium text-primary hover:underline"
        >
          View details
        </button>
      ),
      className: 'text-right',
    },
  ];

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
        title="Testimony analytics"
        description="Track testimony performance and user engagement metrics."
      />

      <div className="space-y-6">
        <div className="card">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Highest engagement
          </h3>
          <Table
            columns={testimonyColumns}
            data={highestEngagement}
            loading={false}
            getRowKey={(item) => item._id}
            mobileTitle={(item) => item.title || item._id}
            mobileSubtitle={(item) => `User: ${item.user?._id}`}
            mobileActions={(item) => (
              <button
                type="button"
                onClick={() =>
                  navigate(`${RoutePaths.TESTIMONY_DETAILS}/${item._id}`)
                }
                className="text-xs font-medium text-primary hover:underline"
              >
                View details
              </button>
            )}
          />
        </div>

        <div className="card">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Most likes
          </h3>
          <Table
            columns={testimonyColumns}
            data={highestLikes}
            loading={false}
            getRowKey={(item) => item._id}
            mobileTitle={(item) => item.title || item._id}
            mobileSubtitle={(item) => `User: ${item.user?._id}`}
            mobileActions={(item) => (
              <button
                type="button"
                onClick={() =>
                  navigate(`${RoutePaths.TESTIMONY_DETAILS}/${item._id}`)
                }
                className="text-xs font-medium text-primary hover:underline"
              >
                View details
              </button>
            )}
          />
        </div>

        <div className="card">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Most views
          </h3>
          <Table
            columns={testimonyColumns}
            data={highestViews}
            loading={false}
            getRowKey={(item) => item._id}
            mobileTitle={(item) => item.title || item._id}
            mobileSubtitle={(item) => `User: ${item.user?._id}`}
            mobileActions={(item) => (
              <button
                type="button"
                onClick={() =>
                  navigate(`${RoutePaths.TESTIMONY_DETAILS}/${item._id}`)
                }
                className="text-xs font-medium text-primary hover:underline"
              >
                View details
              </button>
            )}
          />
        </div>

        <div className="card">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Most active users
          </h3>
          <Table
            columns={userColumns}
            data={mostActiveUsers}
            loading={false}
            getRowKey={(item) => `${item.user?._id}-${item.count}`}
            mobileTitle={(item) => item.user?._id}
          />
        </div>
      </div>
    </>
  );
}
