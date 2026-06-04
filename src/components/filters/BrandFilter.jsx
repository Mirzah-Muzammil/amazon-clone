// src/components/filters/BrandFilter.jsx
import React from 'react';

const ITEM_CLASSES =
  'flex items-center gap-3 rounded-lg border border-transparent px-2 py-1.5 text-sm text-slate-700 hover:border-slate-200 hover:bg-slate-50';
const CHECKBOX_CLASSES =
  'h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500';
const EMPTY_MESSAGE = 'No brands available for this category.';

const BrandFilter = ({ brands, selectedBrands, onChange }) => {
  const handleToggle = (brand) => {
    if (selectedBrands.includes(brand)) {
      onChange(selectedBrands.filter((item) => item !== brand));
      return;
    }
    onChange([...selectedBrands, brand]);
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">Brand</h3>
      <div className="mt-3 space-y-2">
        {brands.length === 0 ? (
          <p className="text-xs text-slate-500">{EMPTY_MESSAGE}</p>
        ) : (
          brands.map((brand) => (
            <label
              key={brand}
              className={ITEM_CLASSES}
              htmlFor={`brand-${brand}`}
            >
              <input
                id={`brand-${brand}`}
                type="checkbox"
                className={CHECKBOX_CLASSES}
                checked={selectedBrands.includes(brand)}
                onChange={() => handleToggle(brand)}
              />
              <span>{brand}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(BrandFilter);
