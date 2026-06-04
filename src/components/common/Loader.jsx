// src/components/common/Loader.jsx
import React from 'react';

const SKELETON_COUNT = 12;
const GRID_CLASSES =
  'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
const CARD_CLASSES =
  'rounded-xl border border-slate-200 bg-white p-4 shadow-sm';

const SkeletonCard = () => (
  <div className={CARD_CLASSES}>
    <div className="aspect-square w-full rounded-lg bg-slate-200" />
    <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />
    <div className="mt-2 h-4 w-1/2 rounded bg-slate-200" />
    <div className="mt-3 h-4 w-1/3 rounded bg-slate-200" />
  </div>
);

const Loader = () => (
  <div className="animate-pulse" role="status" aria-live="polite">
    <div className={GRID_CLASSES}>
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <SkeletonCard key={`skeleton-${index}`} />
      ))}
    </div>
  </div>
);

export default React.memo(Loader);
