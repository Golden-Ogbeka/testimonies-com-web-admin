import type React from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  primaryLabel: string;
  onPrimary: () => void;
  onClose: () => void;
  loading?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  open,
  title,
  children,
  primaryLabel,
  onPrimary,
  onClose,
  loading,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 sm:px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="px-4 sm:px-5 py-4 text-sm text-gray-700 overflow-y-auto flex-1">
          {children}
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-4 sm:px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onPrimary}
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Please wait…' : primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
