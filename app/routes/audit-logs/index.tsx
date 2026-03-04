import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AdminAuditLogsApi } from "../../api/adminAuditLogs";
import FilterBar from "../../common/filter-bar";
import PageHeader from "../../common/page-header";
import { Table, type TableColumn } from "../../common/table";
import { sendCatchFeedback } from "../../functions/feedback";
import type { AuditLogItem } from "../../types";
import { RoutePaths } from "../route-paths";

export function meta() {
  return [
    { title: "Audit logs | Testimonies Admin" },
    { name: "description", content: "View system audit logs and admin activity." },
  ];
}

export default function AuditLogsIndex() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminAuditLogsApi.list({ page: 1, limit: 100 });
        setLogs(data.data.auditLogs.docs);
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
    if (!query) return logs;
    return logs.filter((log) =>
      log.action.toLowerCase().includes(query) ||
      log.category.toLowerCase().includes(query) ||
      log.level.toLowerCase().includes(query)
    );
  }, [logs, search]);

  const columns: TableColumn<AuditLogItem>[] = [
    {
      id: "action",
      header: "Action",
      accessor: (log) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{log.action}</span>
          <span className="text-xs text-gray-500">{log.category}</span>
        </div>
      ),
    },
    {
      id: "level",
      header: "Level",
      accessor: (log) => {
        const colors: Record<string, string> = {
          info: "bg-blue-50 text-blue-700",
          warning: "bg-yellow-50 text-yellow-700",
          error: "bg-red-50 text-red-700",
          critical: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
              colors[log.level] || "bg-gray-100 text-gray-600"
            }`}
          >
            {log.level}
          </span>
        );
      },
    },
    {
      id: "userType",
      header: "User type",
      accessor: (log) => (
        <span className="text-xs capitalize text-gray-600">{log.userType || "—"}</span>
      ),
    },
    {
      id: "timestamp",
      header: "Timestamp",
      accessor: (log) => (
        <span className="text-xs text-gray-600">
          {new Date(log.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      accessor: (log) => (
        <button
          type="button"
          onClick={() => navigate(`${RoutePaths.AUDIT_LOG_DETAILS}/${log._id}`)}
          className="text-xs font-medium text-primary hover:underline"
        >
          View details
        </button>
      ),
      className: "text-right",
    },
  ];

  return (
    <>
      <PageHeader
        title="Audit logs"
        description="Track all administrative actions and system events."
      />

      <FilterBar searchValue={search} onSearchChange={setSearch} />

      <Table columns={columns} data={filtered} loading={loading} />
    </>
  );
}
