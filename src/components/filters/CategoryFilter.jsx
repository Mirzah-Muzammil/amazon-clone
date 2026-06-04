// src/components/filters/CategoryFilter.jsx
import React from 'react';

const ITEM_CLASSES =
  'flex items-center gap-3 rounded-lg border border-transparent px-2 py-1.5 text-sm text-slate-700 hover:border-slate-200 hover:bg-slate-50';
const CHECKBOX_CLASSES =
  'h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500';

const normalizeCategory = (category) => {
  if (typeof category === 'string') {
    return { value: category, label: category.replace(/-/g, ' ') };
  }
  if (category && typeof category === 'object') {
    const value =
      category.slug || category.name || category.id || String(category);
    const labelSource = category.name || category.slug || String(category);
    return { value: String(value), label: String(labelSource).replace(/-/g, ' ') };
  }
  const fallback = String(category);
  return { value: fallback, label: fallback };
};

const CategoryFilter = ({ categories, selectedCategories, onChange }) => {
  const handleToggle = (category) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter((item) => item !== category));
      return;
    }
    onChange([...selectedCategories, category]);
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">Category</h3>
      <div className="mt-3 space-y-2">
        <label className={ITEM_CLASSES} htmlFor="category-all">
          <input
            id="category-all"
            name="category"
            type="checkbox"
            className={CHECKBOX_CLASSES}
            checked={selectedCategories.length === 0}
            onChange={() => onChange([])}
          />
          <span>All</span>
        </label>
        {categories.map((category) => {
          const normalized = normalizeCategory(category);
          return (
            <label
              key={normalized.value}
              className={ITEM_CLASSES}
              htmlFor={`category-${normalized.value}`}
            >
              <input
                id={`category-${normalized.value}`}
                name="category"
                type="checkbox"
                className={CHECKBOX_CLASSES}
                checked={selectedCategories.includes(normalized.value)}
                onChange={() => handleToggle(normalized.value)}
              />
              <span className="capitalize">{normalized.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(CategoryFilter);
