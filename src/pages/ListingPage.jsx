// src/pages/ListingPage.jsx
import { useState } from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary';
import Loader from '../components/common/Loader';
import Pagination from '../components/common/Pagination';
import FilterPanel from '../components/filters/FilterPanel';
import ProductGrid from '../components/products/ProductGrid';
import { useFilterContext } from '../context/FilterContext';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';

const PAGE_CLASSES = 'flex h-screen flex-col bg-slate-100';
const CONTENT_CLASSES =
  'mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col overflow-hidden px-4 pb-6 pt-6 sm:px-6 lg:px-8';
const LAYOUT_CLASSES =
  'grid min-h-0 flex-1 gap-8 overflow-hidden lg:grid-cols-[260px_minmax(0,1fr)]';
const GRID_FULL = 'grid min-h-0 flex-1 gap-8 overflow-hidden';
const HEADER_CLASSES =
  'sticky top-0 z-40 border-b border-slate-200 bg-slate-700/95 backdrop-blur';
const HEADER_INNER =
  'mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8';
const ICON_BUTTON =
  'flex h-10 w-10 items-center justify-center rounded-lg text-slate-100 hover:bg-slate-600/60';
const SEARCH_WRAP =
  'flex flex-1 items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-slate-600 shadow-sm';
const SEARCH_INPUT =
  'w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400';
const ACTIONS_WRAP = 'ml-auto flex items-center gap-3';
const TITLE_CLASSES = 'text-xl font-semibold text-slate-800';
const ERROR_CARD_CLASSES =
  'rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800';
const BUTTON_CLASSES =
  'mt-3 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100';
const PRODUCT_SECTION_CLASSES = 'h-full min-h-0 overflow-y-auto pb-10';

const ListingPage = () => {
  const {
    filters,
    setCategory,
    setMinPrice,
    setMaxPrice,
    setBrands,
    setPage,
    clearFilters,
  } = useFilterContext();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { categories, loading: categoriesLoading, error: categoriesError } =
    useCategories();
  const { products, total, loading, error, uniqueBrands } = useProducts(filters);

  const handleClear = () => clearFilters();
  const handleToggleFilters = () => setFiltersOpen((prev) => !prev);

  if (categoriesError) {
    return (
      <div className={PAGE_CLASSES}>
        <div className={ERROR_CARD_CLASSES}>
          Failed to load categories. Please refresh.
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={PAGE_CLASSES}>
        <header className={HEADER_CLASSES}>
          <div className={HEADER_INNER}>
            <button type="button" className={ICON_BUTTON} onClick={handleToggleFilters}>
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"
                />
              </svg>
            </button>
            <div className={SEARCH_WRAP}>
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-400" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M21 20.3 16.7 16A7.5 7.5 0 1 0 16 16.7L20.3 21 21 20.3zM10.5 17A6.5 6.5 0 1 1 17 10.5 6.5 6.5 0 0 1 10.5 17z"
                />
              </svg>
              <input className={SEARCH_INPUT} placeholder="Search products..." />
            </div>
            <div className={ACTIONS_WRAP}>
              <button type="button" className={ICON_BUTTON} aria-label="Cart">
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.2 6h12.2l-1.2 6.2H8.4L7.2 6zm-.7-2L5 2H2v2h2l2.4 10.4c.2.9 1 1.6 2 1.6h9.5v-2H8.7l-.3-1.4h10.6c.9 0 1.7-.6 1.9-1.5L22 4H6.5z"
                  />
                </svg>
              </button>
              <button type="button" className={ICON_BUTTON} aria-label="Account">
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>
        <div className={CONTENT_CLASSES}>
          <div className="mb-4 flex items-center gap-3 text-slate-700">
            <h1 className={TITLE_CLASSES}>{filtersOpen ? 'Filters' : 'Products'}</h1>
          </div>
          <div className={filtersOpen ? LAYOUT_CLASSES : GRID_FULL}>
            {filtersOpen && (
              <FilterPanel
                categories={categories}
                brands={uniqueBrands}
                filters={filters}
                onCategoryChange={setCategory}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
                onBrandChange={setBrands}
                onClear={handleClear}
              />
            )}
            <section className={PRODUCT_SECTION_CLASSES}>
              {loading || categoriesLoading ? (
                <Loader />
              ) : error ? (
                <div className={ERROR_CARD_CLASSES}>
                  Failed to load products. Please try again.
                  <button
                    type="button"
                    className={BUTTON_CLASSES}
                    onClick={() => setPage(1)}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <ProductGrid products={products} onClear={handleClear} />
                  <Pagination
                    total={total}
                    page={filters.page}
                    limit={filters.limit}
                    onChange={setPage}
                  />
                </>
              )}
            </section>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ListingPage;
