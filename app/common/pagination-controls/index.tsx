interface PaginationControlsProps {
  page: number;
  totalPages: number;
  totalResults?: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  page,
  totalPages,
  totalResults,
  onPageChange,
}: PaginationControlsProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const safePage = Math.min(Math.max(page, 1), safeTotalPages);

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-600">
        Page <span className="font-semibold text-slate-900">{safePage}</span> of{' '}
        <span className="font-semibold text-slate-900">{safeTotalPages}</span>
        {typeof totalResults === 'number' && (
          <>
            {' '}
            •{' '}
            <span className="font-semibold text-slate-900">
              {totalResults}
            </span>{' '}
            total
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1}
          className="btn-secondary cursor-pointer"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= safeTotalPages}
          className="btn-secondary cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
