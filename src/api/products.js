// src/api/products.js
const API_BASE = "https://dummyjson.com";
const DEFAULT_LIMIT = 20;
const DEFAULT_SKIP = 0;

const fetchJson = async (url, signal) => {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    const message = `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return response.json();
};

export const getProducts = async (
  limit = DEFAULT_LIMIT,
  skip = DEFAULT_SKIP,
  signal,
) => fetchJson(`${API_BASE}/products?limit=${limit}&skip=${skip}`, signal);

export const getProductsByCategory = async (
  category,
  limit = DEFAULT_LIMIT,
  skip = DEFAULT_SKIP,
  signal,
) =>
  fetchJson(
    `${API_BASE}/products/category/${category}?limit=${limit}&skip=${skip}`,
    signal,
  );

export const getCategories = async (signal) =>
  fetchJson(`${API_BASE}/products/categories`, signal);

export const getProductById = async (id, signal) =>
  fetchJson(`${API_BASE}/products/${id}`, signal);
