// src/hooks/useProducts.js
import { useEffect, useMemo, useState } from "react";
import { getProducts, getProductsByCategory } from "../api/products";
import { applyClientFilters } from "../utils/filterUtils";
import { useDebounce } from "./useDebounce";

const EMPTY_LIST = [];
const EMPTY_BRANDS = [];
const DEFAULT_TOTAL = 0;

const getUniqueBrands = (products) => {
  if (!products.length) return EMPTY_BRANDS;
  const set = new Set();
  products.forEach((product) => {
    if (product.brand) set.add(product.brand);
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b));
};

export const useProducts = (filters) => {
  const debouncedMinPrice = useDebounce(filters.minPrice, 300);
  const debouncedMaxPrice = useDebounce(filters.maxPrice, 300);
  const [rawProducts, setRawProducts] = useState(EMPTY_LIST);
  const [total, setTotal] = useState(DEFAULT_TOTAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const skip = (filters.page - 1) * filters.limit;
        const data = filters.category
          ? await getProductsByCategory(
              filters.category,
              filters.limit,
              skip,
              controller.signal,
            )
          : await getProducts(filters.limit, skip, controller.signal);

        if (!isActive) return;
        const list = Array.isArray(data?.products) ? data.products : EMPTY_LIST;
        setRawProducts(list);
        setTotal(Number(data?.total) || DEFAULT_TOTAL);
      } catch (err) {
        if (!isActive) return;
        if (err.name === "AbortError") return;
        setRawProducts(EMPTY_LIST);
        setTotal(DEFAULT_TOTAL);
        setError(err);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [filters.category, filters.page, filters.limit]);

  const filteredProducts = useMemo(
    () =>
      applyClientFilters(rawProducts, {
        minPrice: debouncedMinPrice,
        maxPrice: debouncedMaxPrice,
        brands: filters.brands,
      }),
    [rawProducts, debouncedMinPrice, debouncedMaxPrice, filters.brands],
  );

  const uniqueBrands = useMemo(
    () => getUniqueBrands(rawProducts),
    [rawProducts],
  );

  return {
    products: filteredProducts,
    total,
    loading,
    error,
    uniqueBrands,
  };
};
