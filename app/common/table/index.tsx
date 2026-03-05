import type React from 'react';

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
  getRowKey?: (row: T, index: number) => string | number;
  mobileTitle?: (row: T) => React.ReactNode;
  mobileSubtitle?: (row: T) => React.ReactNode;
  mobileFields?: Array<{
    label: string;
    value: (row: T) => React.ReactNode;
  }>;
  mobileActions?: (row: T) => React.ReactNode;
}

export function Table<T>({
  columns,
  data,
  loading,
  emptyMessage,
  getRowKey,
  mobileTitle,
  mobileSubtitle,
  mobileFields,
  mobileActions,
}: TableProps<T>) {
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
          {emptyMessage ?? 'No records found for this view.'}
        </p>
      </div>
    );
  }

  const resolvedMobileFields =
    mobileFields ??
    columns
      .filter((column) => column.header.trim().length > 0)
      .map((column) => ({
        label: column.header,
        value: column.accessor,
      }));

  return (
    <>
      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    scope="col"
                    className={`px-3 sm:px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 ${
                      column.hideOnMobile ? 'hidden sm:table-cell' : ''
                    } ${column.className ?? ''}`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row, index) => (
                <tr
                  key={getRowKey ? getRowKey(row, index) : index}
                  className="hover:bg-gray-50"
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={`px-3 sm:px-4 py-3 align-middle text-sm ${
                        column.hideOnMobile ? 'hidden sm:table-cell' : ''
                      } ${column.className ?? ''}`}
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

      <div className="md:hidden space-y-3">
        {data.map((row, index) => (
          <article
            key={getRowKey ? getRowKey(row, index) : index}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            {(mobileTitle || mobileSubtitle) && (
              <div className="mb-3 border-b border-slate-100 pb-3">
                {mobileTitle && (
                  <h3 className="text-sm font-semibold text-slate-900">
                    {mobileTitle(row)}
                  </h3>
                )}
                {mobileSubtitle && (
                  <p className="mt-1 text-xs text-slate-500">
                    {mobileSubtitle(row)}
                  </p>
                )}
              </div>
            )}

            <dl className="space-y-2">
              {resolvedMobileFields.map((field) => (
                <div
                  key={`${field.label}-${index}`}
                  className="grid grid-cols-[7rem_1fr] items-start gap-2"
                >
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {field.label}
                  </dt>
                  <dd className="text-sm text-slate-800">{field.value(row)}</dd>
                </div>
              ))}
            </dl>

            {mobileActions && (
              <div className="mt-4 border-t border-slate-100 pt-3">
                {mobileActions(row)}
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
