import React from 'react';
import ProductCard from './ProductCard';

const GRID_CLASSES =
  'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
const EMPTY_CLASSES =
  'flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center';
const EMPTY_TITLE = 'No products match these filters.';
const EMPTY_MESSAGE = 'Try clearing filters or adjusting your criteria.';
const BUTTON_CLASSES =
  'mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100';

const ProductGrid = ({ products, onClear }) => {
  if (products.length === 0) {
    return (
      <div className={EMPTY_CLASSES}>
        <h3 className="text-lg font-semibold text-slate-900">{EMPTY_TITLE}</h3>
        <p className="mt-2 text-sm text-slate-600">{EMPTY_MESSAGE}</p>
        <button type="button" className={BUTTON_CLASSES} onClick={onClear}>
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className={GRID_CLASSES}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default React.memo(ProductGrid);
