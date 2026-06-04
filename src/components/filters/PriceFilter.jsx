// src/components/filters/PriceFilter.jsx
import React from 'react';

const INPUT_CLASSES =
  'w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100';

const PriceFilter = ({ minPrice, maxPrice, onMinChange, onMaxChange }) => (
  <div>
    <h3 className="text-sm font-semibold text-slate-900">Price Range</h3>
    <div className="mt-3 grid grid-cols-2 gap-3">
      <label className="text-xs text-slate-600">
        <input
          type="number"
          min="0"
          inputMode="numeric"
          value={minPrice}
          onChange={(event) => onMinChange(event.target.value)}
          className={INPUT_CLASSES}
          placeholder="Min"
        />
      </label>
      <label className="text-xs text-slate-600">
        <input
          type="number"
          min="0"
          inputMode="numeric"
          value={maxPrice}
          onChange={(event) => onMaxChange(event.target.value)}
          className={INPUT_CLASSES}
          placeholder="Max"
        />
      </label>
    </div>
  </div>
);

export default React.memo(PriceFilter);
