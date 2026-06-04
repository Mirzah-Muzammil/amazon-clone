// src/components/filters/FilterPanel.jsx
import React, { useMemo, useState } from 'react';
import BrandFilter from './BrandFilter';
import CategoryFilter from './CategoryFilter';
import PriceFilter from './PriceFilter';

const PANEL_CLASSES =
  'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm';
const SECTION_CLASSES = 'space-y-6';
const SEARCH_WRAP =
  'flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600';
const SEARCH_INPUT =
  'w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400';
const APPLY_BUTTON =
  'mt-3 w-full rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-600';
const CLEAR_BUTTON =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100';

const getCategoryText = (category) => {
  if (typeof category === 'string') return category.replace(/-/g, ' ');
  if (category && typeof category === 'object') {
    return String(category.name || category.slug || category.id || category);
  }
  return String(category);
};

const FilterPanel = ({
  categories,
  brands,
  filters,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onBrandChange,
  onClear,
}) => {
  const [filterSearch, setFilterSearch] = useState('');
  const normalizedFilterSearch = filterSearch.trim().toLowerCase();
  const visibleCategories = useMemo(() => {
    if (!normalizedFilterSearch) return categories;
    return categories.filter((category) =>
      getCategoryText(category).toLowerCase().includes(normalizedFilterSearch)
    );
  }, [categories, normalizedFilterSearch]);
  const visibleBrands = useMemo(() => {
    if (!normalizedFilterSearch) return brands;
    return brands.filter((brand) =>
      brand.toLowerCase().includes(normalizedFilterSearch)
    );
  }, [brands, normalizedFilterSearch]);

  return (
    <aside className="h-full min-h-0 overflow-y-auto lg:sticky lg:top-4">
      <div className={PANEL_CLASSES}>
        <div className="mb-5">
          <div className={SEARCH_WRAP}>
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" aria-hidden="true">
              <path
                fill="currentColor"
                d="M21 20.3 16.7 16A7.5 7.5 0 1 0 16 16.7L20.3 21 21 20.3zM10.5 17A6.5 6.5 0 1 1 17 10.5 6.5 6.5 0 0 1 10.5 17z"
              />
            </svg>
            <input
              className={SEARCH_INPUT}
              placeholder="Search filters..."
              value={filterSearch}
              onChange={(event) => setFilterSearch(event.target.value)}
            />
          </div>
        </div>
        <div className={SECTION_CLASSES}>
          <CategoryFilter
            categories={visibleCategories}
            selectedCategories={filters.categories}
            onChange={onCategoryChange}
          />
          <div>
            <PriceFilter
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onMinChange={onMinPriceChange}
              onMaxChange={onMaxPriceChange}
            />
            <button type="button" className={APPLY_BUTTON}>
              Apply
            </button>
          </div>
          <BrandFilter
            brands={visibleBrands}
            selectedBrands={filters.brands}
            onChange={onBrandChange}
          />
        </div>
        <button type="button" className={`${CLEAR_BUTTON} mt-6`} onClick={onClear}>
          Clear all filters
        </button>
      </div>
    </aside>
  );
};

export default React.memo(FilterPanel);
