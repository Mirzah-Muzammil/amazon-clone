// src/hooks/useProducts.js
import { useEffect, useMemo, useState } from "react";
import { getProducts, getProductsByCategory, searchProducts } from "../api/products";
import { applyClientFilters } from "../utils/filterUtils";
import { useDebounce } from "./useDebounce";

const EMPTY_LIST = [];
const EMPTY_BRANDS = [];
const DEFAULT_TOTAL = 0;
const CLIENT_FILTER_LIMIT = 200;

const getUniqueBrands = (products) => {
  if (!products.length) return EMPTY_BRANDS;
  const set = new Set();
  products.forEach((product) => {
    if (product.brand) set.add(product.brand);
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b));
};

export const useProducts = (filters) => {
  const debouncedSearch = useDebounce(filters.search, 300);
  const debouncedMinPrice = useDebounce(filters.minPrice, 300);
  const debouncedMaxPrice = useDebounce(filters.maxPrice, 300);
  const [rawProducts, setRawProducts] = useState(EMPTY_LIST);
  const [filteredProducts, setFilteredProducts] = useState(EMPTY_LIST);
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
        const hasClientFilters =
          filters.categories.length > 0 ||
          Boolean(debouncedSearch.trim()) ||
          Boolean(debouncedMinPrice) ||
          Boolean(debouncedMaxPrice) ||
          filters.brands.length > 0;

        if (hasClientFilters) {
          const responses = filters.categories.length
            ? await Promise.all(
                filters.categories.map((category) =>
                  getProductsByCategory(
                    category,
                    CLIENT_FILTER_LIMIT,
                    0,
                    controller.signal,
                  ),
                ),
              )
            : [
                debouncedSearch.trim()
                  ? await searchProducts(
                      debouncedSearch.trim(),
                      CLIENT_FILTER_LIMIT,
                      0,
                      controller.signal,
                    )
                  : await getProducts(CLIENT_FILTER_LIMIT, 0, controller.signal),
              ];

          if (!isActive) return;
          const mergedProducts = responses.flatMap((data) =>
            Array.isArray(data?.products) ? data.products : EMPTY_LIST,
          );
          const uniqueProducts = Array.from(
            new Map(mergedProducts.map((product) => [product.id, product])).values(),
          );
          const nextProducts = applyClientFilters(uniqueProducts, {
            minPrice: debouncedMinPrice,
            maxPrice: debouncedMaxPrice,
            brands: filters.brands,
            search: debouncedSearch,
          });
          setRawProducts(uniqueProducts);
          setFilteredProducts(nextProducts.slice(skip, skip + filters.limit));
          setTotal(nextProducts.length);
          return;
        }

        const data = await getProducts(filters.limit, skip, controller.signal);

        if (!isActive) return;
        const list = Array.isArray(data?.products) ? data.products : EMPTY_LIST;
        setRawProducts(list);
        setFilteredProducts(list);
        setTotal(Number(data?.total) || DEFAULT_TOTAL);
      } catch (err) {
        if (!isActive) return;
        if (err.name === "AbortError") return;
        setRawProducts(EMPTY_LIST);
        setFilteredProducts(EMPTY_LIST);
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
  }, [
    filters.categories,
    filters.page,
    filters.limit,
    filters.brands,
    debouncedSearch,
    debouncedMinPrice,
    debouncedMaxPrice,
  ]);

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
