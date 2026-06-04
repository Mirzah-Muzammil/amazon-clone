// src/components/common/Pagination.jsx
import React from 'react';

const BUTTON_BASE =
  'rounded-md border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50';
const BUTTON_PRIMARY =
  'border-slate-300 bg-white text-slate-700 hover:bg-slate-100';
const BUTTON_ACTIVE = 'border-blue-500 bg-blue-500 text-white';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const Pagination = ({ total, page, limit, onChange }) => {
  const safeLimit = Math.max(1, limit || 1);
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const currentPage = clamp(page, 1, totalPages);
  const start = total === 0 ? 0 : (currentPage - 1) * safeLimit + 1;
  const end = Math.min(total, currentPage * safeLimit);

  const handlePrev = () => onChange(Math.max(1, currentPage - 1));
  const handleNext = () => onChange(Math.min(totalPages, currentPage + 1));

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
    const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    return startPage + index;
  });

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`${BUTTON_BASE} ${BUTTON_PRIMARY}`}
          onClick={handlePrev}
          disabled={currentPage <= 1}
        >
          ← Previous
        </button>
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={`${BUTTON_BASE} ${
              pageNumber === currentPage ? BUTTON_ACTIVE : BUTTON_PRIMARY
            }`}
            onClick={() => onChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        <button
          type="button"
          className={`${BUTTON_BASE} ${BUTTON_PRIMARY}`}
          onClick={handleNext}
          disabled={currentPage >= totalPages}
        >
          Next →
        </button>
      </div>
      <p className="text-sm text-slate-500">
        Showing {start}–{end} of {total} products
      </p>
    </div>
  );
};

export default React.memo(Pagination);
