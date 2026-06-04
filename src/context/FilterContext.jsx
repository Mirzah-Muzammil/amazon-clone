// src/context/FilterContext.jsx
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 8;

const ACTIONS = {
  SET_CATEGORY: 'SET_CATEGORY',
  SET_MIN_PRICE: 'SET_MIN_PRICE',
  SET_MAX_PRICE: 'SET_MAX_PRICE',
  SET_BRANDS: 'SET_BRANDS',
  SET_PAGE: 'SET_PAGE',
  SET_LIMIT: 'SET_LIMIT',
  CLEAR: 'CLEAR',
};

const BASE_STATE = {
  category: '',
  minPrice: '',
  maxPrice: '',
  brands: [],
  page: DEFAULT_PAGE,
  limit: DEFAULT_LIMIT,
};

const parseFiltersFromSearch = (search) => {
  const params = new URLSearchParams(search);
  return {
    ...BASE_STATE,
    category: params.get('category') || '',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    brands: params.get('brands') ? params.get('brands').split(',') : [],
    page: Number(params.get('page')) || DEFAULT_PAGE,
  };
};

const filterReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_CATEGORY:
      return { ...state, category: action.payload, page: DEFAULT_PAGE };
    case ACTIONS.SET_MIN_PRICE:
      return { ...state, minPrice: action.payload, page: DEFAULT_PAGE };
    case ACTIONS.SET_MAX_PRICE:
      return { ...state, maxPrice: action.payload, page: DEFAULT_PAGE };
    case ACTIONS.SET_BRANDS:
      return { ...state, brands: action.payload, page: DEFAULT_PAGE };
    case ACTIONS.SET_PAGE:
      return { ...state, page: action.payload };
    case ACTIONS.SET_LIMIT:
      return { ...state, limit: action.payload, page: DEFAULT_PAGE };
    case ACTIONS.CLEAR:
      return { ...BASE_STATE };
    default:
      return state;
  }
};

const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialState = useMemo(
    () => parseFiltersFromSearch(location.search),
    [location.search]
  );
  const [filters, dispatch] = useReducer(filterReducer, initialState);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.brands.length) params.set('brands', filters.brands.join(','));
    params.set('page', String(filters.page));
    navigate(`?${params.toString()}`, { replace: true });
  }, [filters, navigate]);

  const value = {
    filters,
    setCategory: (category) =>
      dispatch({ type: ACTIONS.SET_CATEGORY, payload: category }),
    setMinPrice: (minPrice) =>
      dispatch({ type: ACTIONS.SET_MIN_PRICE, payload: minPrice }),
    setMaxPrice: (maxPrice) =>
      dispatch({ type: ACTIONS.SET_MAX_PRICE, payload: maxPrice }),
    setBrands: (brands) =>
      dispatch({ type: ACTIONS.SET_BRANDS, payload: brands }),
    setPage: (page) => dispatch({ type: ACTIONS.SET_PAGE, payload: page }),
    setLimit: (limit) => dispatch({ type: ACTIONS.SET_LIMIT, payload: limit }),
    clearFilters: () => dispatch({ type: ACTIONS.CLEAR }),
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within FilterProvider');
  }
  return context;
};
