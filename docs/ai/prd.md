# PRD: Leegality Frontend Engineer Assessment
## Product Listing & Detail Page (Amazon-style)

---

## 1. Overview

**Project:** E-Commerce Product Listing Application  
**Tech Stack:** React 18+, React Router v6, Tailwind CSS  
**API:** https://dummyjson.com/docs/products  
**Timeline:** 1–2 days sprint  
**Goal:** Demonstrate clean, scalable frontend architecture with real API integration, filtering logic, state management, and routing.

---

## 2. Architecture Decisions

### Folder Structure
```
src/
├── api/
│   └── products.js          # All API calls (single source of truth)
├── components/
│   ├── common/
│   │   ├── Loader.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── Pagination.jsx
│   ├── filters/
│   │   ├── FilterPanel.jsx
│   │   ├── CategoryFilter.jsx
│   │   ├── PriceFilter.jsx
│   │   └── BrandFilter.jsx
│   └── products/
│       ├── ProductCard.jsx
│       ├── ProductGrid.jsx
│       └── ProductDetail.jsx
├── context/
│   └── FilterContext.jsx     # Global filter state (persisted across navigation)
├── hooks/
│   ├── useProducts.js
│   ├── useCategories.js
│   └── useDebounce.js
├── pages/
│   ├── ListingPage.jsx
│   └── DetailPage.jsx
├── utils/
│   └── filterUtils.js        # Pure filter functions (testable)
├── App.jsx
└── main.jsx
```

### State Management
- **React Context + useReducer** for filter state (no Redux needed at this scale)
- Filter state persisted in URL query params (`?category=laptops&minPrice=100`) so browser back/forward works natively
- No localStorage needed — URL is the single source of truth for filters

### Routing
```
/                  → ListingPage (redirect)
/products          → ListingPage
/product/:id       → DetailPage
```

---

## 3. API Layer

### `src/api/products.js`
```js
const BASE = 'https://dummyjson.com';

export const getProducts = (limit = 20, skip = 0) =>
  fetch(`${BASE}/products?limit=${limit}&skip=${skip}`).then(r => r.json());

export const getProductsByCategory = (category, limit = 20, skip = 0) =>
  fetch(`${BASE}/products/category/${category}?limit=${limit}&skip=${skip}`).then(r => r.json());

export const getCategories = () =>
  fetch(`${BASE}/products/categories`).then(r => r.json());

export const getProductById = (id) =>
  fetch(`${BASE}/products/${id}`).then(r => r.json());
```

**Rules:**
- All API calls go through `src/api/products.js` — never fetch directly inside components
- Every call wrapped in try/catch at the hook level
- API errors surface as `error` state (never swallowed silently)

---

## 4. Filtering Architecture

### Strategy
- **Category** → server-side (use `/products/category/{category}` endpoint)
- **Price range** → client-side (filter `products.products` array after fetch)
- **Brand** → client-side (extract unique brands, filter on client)

### Combined Filter Logic (`src/utils/filterUtils.js`)
```js
export const applyClientFilters = (products, { minPrice, maxPrice, brands }) => {
  return products.filter(p => {
    const inPriceRange =
      (!minPrice || p.price >= Number(minPrice)) &&
      (!maxPrice || p.price <= Number(maxPrice));
    const inBrand = brands.length === 0 || brands.includes(p.brand);
    return inPriceRange && inBrand;
  });
};
```

### Filter State Shape
```js
{
  category: '',        // string — triggers server fetch
  minPrice: '',        // string — client filter
  maxPrice: '',        // string — client filter
  brands: [],          // string[] — client filter
  page: 1,             // resets on any filter change
  limit: 20
}
```

### Rules:
- Changing `category` → re-fetch from server + reset page
- Changing price/brand → client filter on already-fetched data (no new API call)
- Any filter change → reset `page` to 1

---

## 5. Component Specs

### `ProductCard.jsx`
Props: `{ product }`  
Displays: thumbnail image, title, price (formatted with `$`), star rating  
Behavior: `onClick` navigates to `/product/:id`  
Style: hover lift effect, image aspect-ratio locked (1:1)

### `FilterPanel.jsx`
- Sticky on desktop (`position: sticky; top: 1rem`)
- Collapsible on mobile
- Contains: CategoryFilter, PriceFilter, BrandFilter
- "Clear All Filters" button resets context state + URL params

### `Pagination.jsx`
Props: `{ total, page, limit, onChange }`  
Shows: `Showing 1–20 of 194 products`  
Uses `limit/skip` pattern with DummyJSON

### `ProductDetail.jsx`
- Image gallery (thumbnails if available)
- All required fields: name, price, rating, description, brand, category
- Back button: `navigate(-1)` — preserves filter state in URL

---

## 6. Custom Hooks

### `useProducts(filters)`
```js
const { products, total, loading, error } = useProducts(filters);
```
- Debounces price filter changes (300ms)
- Cancels in-flight requests on filter change (AbortController)
- Returns empty array `[]` on error (never undefined)

### `useCategories()`
```js
const { categories, loading, error } = useCategories();
```
- Fetches once on mount, cached in module scope

### `useDebounce(value, delay)`
- Generic debounce hook for price inputs

---

## 7. URL Sync (Filter Persistence)

```js
// In FilterContext — sync filters → URL
useEffect(() => {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  if (filters.brands.length) params.set('brands', filters.brands.join(','));
  params.set('page', filters.page);
  navigate(`?${params.toString()}`, { replace: true });
}, [filters]);

// On mount — read URL → filters
const params = new URLSearchParams(location.search);
const initial = {
  category: params.get('category') || '',
  minPrice: params.get('minPrice') || '',
  maxPrice: params.get('maxPrice') || '',
  brands: params.get('brands') ? params.get('brands').split(',') : [],
  page: Number(params.get('page')) || 1,
};
```

**Why:** When user clicks Back from Detail page, browser restores the URL with all filters intact.

---

## 8. Error & Loading States

| State | Behavior |
|---|---|
| Initial load | Full-page skeleton (3×4 card grid) |
| Category change | Grid skeleton, filters still interactive |
| API error | Error card with "Retry" button |
| No results | Empty state illustration with "Clear Filters" CTA |
| Product not found | 404-style message with back link |

---

## 9. Performance Considerations

- **Debounce** price inputs (300ms) to avoid firing on every keystroke
- **AbortController** on every fetch — cancel stale requests
- **Image lazy loading** (`loading="lazy"` on all `<img>`)
- **React.memo** on `ProductCard` — prevents re-render when parent filters change
- Categories fetched **once** and cached (they don't change)

---

## 10. Coding Standards

### Naming
- Components: PascalCase (`ProductCard.jsx`)
- Hooks: camelCase prefixed with `use` (`useProducts.js`)
- Utilities: camelCase (`filterUtils.js`)
- Constants: SCREAMING_SNAKE_CASE (`API_BASE_URL`)

### Rules
- No inline styles (use Tailwind or CSS modules)
- No direct DOM manipulation
- No `any` if using TypeScript
- Every async function has error handling
- No magic numbers — extract to named constants
- Prop-types or TypeScript interfaces on all components

### Component Rules
- Single responsibility — one job per component
- Max ~150 lines per component file
- Extract custom logic into hooks, not inside JSX
- No API calls inside JSX render — use hooks

---

## 11. README Template

```md
# Leegality Frontend Assessment

## Setup
npm install && npm run dev

## Assumptions
- Price filtering is client-side (DummyJSON doesn't support server-side price range)
- Brand data is extracted from fetched products (no dedicated brands endpoint)
- Pagination resets on filter changes to avoid empty pages

## Architecture
- FilterContext with URL sync for filter persistence across navigation
- API layer abstracted into src/api/products.js
- Client-side filtering for price/brand; server-side for category

## Improvements (given more time)
- Add sorting (price asc/desc, rating)
- Cart functionality
- Wishlist with localStorage
- Skeleton shimmer animations
- Unit tests with React Testing Library
- Storybook for component documentation
```

---

## 12. Implementation Order (Agent Steps)

| Step | Task | Files |
|---|---|---|
| 1 | Project setup (Vite + React + React Router + Tailwind) | `package.json`, `vite.config.js` |
| 2 | API layer | `src/api/products.js` |
| 3 | Filter context + URL sync | `src/context/FilterContext.jsx` |
| 4 | Custom hooks | `src/hooks/useProducts.js`, `useCategories.js`, `useDebounce.js` |
| 5 | Utility functions | `src/utils/filterUtils.js` |
| 6 | Common components | `Loader.jsx`, `Pagination.jsx`, `ErrorBoundary.jsx` |
| 7 | Filter components | `FilterPanel.jsx`, `CategoryFilter.jsx`, `PriceFilter.jsx`, `BrandFilter.jsx` |
| 8 | Product components | `ProductCard.jsx`, `ProductGrid.jsx` |
| 9 | Pages | `ListingPage.jsx`, `DetailPage.jsx` |
| 10 | App routing | `App.jsx`, `main.jsx` |
| 11 | Styling polish | Tailwind responsive layout |
| 12 | README | `README.md` |
