// src/utils/filterUtils.js
const EMPTY_TEXT = "";
const MIN_RATING = 0;
const MAX_RATING = 5;
const STAR_FULL = "★";
const STAR_EMPTY = "☆";

const includesSearch = (product, query) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  return [product.title, product.description, product.brand, product.category]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(normalizedQuery));
};

export const applyClientFilters = (
  products,
  { minPrice, maxPrice, brands, search = "" },
) =>
  products.filter((product) => {
    const inPriceRange =
      (!minPrice || product.price >= Number(minPrice)) &&
      (!maxPrice || product.price <= Number(maxPrice));
    const inBrand = brands.length === 0 || brands.includes(product.brand);
    return inPriceRange && inBrand && includesSearch(product, search);
  });

export const formatPrice = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "$0";
  }
  return `$${Number(value).toFixed(2)}`;
};

export const renderStars = (rating) => {
  const normalized = Math.min(
    MAX_RATING,
    Math.max(MIN_RATING, Number(rating) || MIN_RATING),
  );
  const fullStars = Math.round(normalized);
  const emptyStars = MAX_RATING - fullStars;
  return (
    `${STAR_FULL.repeat(fullStars)}${STAR_EMPTY.repeat(emptyStars)}` ||
    EMPTY_TEXT
  );
};
