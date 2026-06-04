// src/hooks/useCategories.js
import { useEffect, useState } from "react";
import { getCategories } from "../api/products";

const EMPTY_LIST = [];
let cachedCategories = null;
let cachedError = null;

export const useCategories = () => {
  const [categories, setCategories] = useState(cachedCategories || EMPTY_LIST);
  const [loading, setLoading] = useState(!cachedCategories);
  const [error, setError] = useState(cachedError);

  useEffect(() => {
    if (cachedCategories || cachedError) {
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    let isActive = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories(controller.signal);
        if (!isActive) return;
        cachedCategories = Array.isArray(data) ? data : EMPTY_LIST;
        setCategories(cachedCategories);
        cachedError = null;
        setError(null);
      } catch (err) {
        if (!isActive) return;
        if (err.name === "AbortError") return;
        cachedCategories = EMPTY_LIST;
        cachedError = err;
        setCategories(EMPTY_LIST);
        setError(err);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchCategories();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  return { categories, loading, error };
};
