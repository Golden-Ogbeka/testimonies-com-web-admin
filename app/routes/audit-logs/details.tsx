import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AdminAuditLogsApi } from "../../api/adminAuditLogs";
import PageHeader from "../../common/page-header";
import { getResponseResource } from "../../functions/api-response";
import { sendCatchFeedback } from "../../functions/feedback";
import type { AuditLogItem } from "../../types";
import { RoutePaths } from "../route-paths";

export function meta() {
  return [
    { title: "Audit log details | Testimonies Admin" },
    { name: "description", content: "View detailed audit log information." },
  ];
}

export default function AuditLogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [log, setLog] = useState<AuditLogItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const { data } = await AdminAuditLogsApi.getById(id);
        setLog(getResponseResource<AuditLogItem>(data, "auditLog"));
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!log) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-sm text-gray-600">Audit log not found</p>
        <button
          type="button"
          onClick={() => navigate(RoutePaths.AUDIT_LOGS)}
          className="mt-4 text-xs font-medium text-primary hover:underline"
        >
          Back to audit logs
        </button>
      </div>
    );
  }

  const levelColors: Record<string, string> = {
    info: "bg-blue-50 text-blue-700",
    warning: "bg-yellow-50 text-yellow-700",
    error: "bg-red-50 text-red-700",
    critical: "bg-red-100 text-red-800",
  };

  return (
    <>
      <PageHeader
        title="Audit log details"
        description={`Log entry from ${new Date(log.createdAt).toLocaleString()}`}
        actions={
          <button
            type="button"
            onClick={() => navigate(RoutePaths.AUDIT_LOGS)}
            className="text-xs font-medium text-gray-600 hover:underline"
          >
            ← Back to logs
          </button>
        }
      />

      <div className="card">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-medium text-gray-500">Action</label>
              <p className="mt-1 text-sm text-gray-900">{log.action}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Category</label>
              <p className="mt-1 text-sm text-gray-900">{log.category}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Level</label>
              <span
                className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  levelColors[log.level] || "bg-gray-100 text-gray-600"
                }`}
              >
                {log.level}
              </span>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">User type</label>
              <p className="mt-1 text-sm capitalize text-gray-900">
                {log.userType || "—"}
              </p>
            </div>
            {log.adminId && (
              <div>
                <label className="text-xs font-medium text-gray-500">Admin ID</label>
                <p className="mt-1 font-mono text-xs text-gray-900">{log.adminId}</p>
              </div>
            )}
            {log.userId && (
              <div>
                <label className="text-xs font-medium text-gray-500">User ID</label>
                <p className="mt-1 font-mono text-xs text-gray-900">{log.userId}</p>
              </div>
            )}
            {log.ipAddress && (
              <div>
                <label className="text-xs font-medium text-gray-500">IP address</label>
                <p className="mt-1 font-mono text-xs text-gray-900">{log.ipAddress}</p>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-gray-500">Timestamp</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {log.userAgent && (
            <div>
              <label className="text-xs font-medium text-gray-500">User agent</label>
              <p className="mt-1 font-mono text-xs text-gray-700">{log.userAgent}</p>
            </div>
          )}

          {log.details && Object.keys(log.details).length > 0 && (
            <div>
              <label className="text-xs font-medium text-gray-500">Details</label>
              <pre className="mt-1 overflow-auto rounded-md bg-gray-50 p-3 font-mono text-xs text-gray-800">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
