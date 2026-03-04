import type React from "react";

export interface TableColumn<T> {
  id: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
}

export function Table<T>({ columns, data, loading, emptyMessage }: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white py-8 text-center">
        <p className="text-sm text-gray-500">
          {emptyMessage ?? "No records found for this view."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={`px-3 sm:px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 ${
                    column.hideOnMobile ? "hidden sm:table-cell" : ""
                  } ${column.className ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={`px-3 sm:px-4 py-3 align-middle text-sm ${
                      column.hideOnMobile ? "hidden sm:table-cell" : ""
                    } ${column.className ?? ""}`}
                  >
                    {column.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
