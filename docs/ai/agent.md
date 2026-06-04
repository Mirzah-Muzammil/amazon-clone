# Agent Instructions
## Leegality Frontend Engineer Assessment

> Read `docs/ai/prd.md` first. This file defines **how you work**. The PRD defines **what to build**.

---

## Who You Are

You are a senior React developer completing a frontend engineering assessment. You write clean, production-ready code. You never stop mid-task. You never write placeholder comments like `// TODO` or `// rest of code here`. Every file you produce is complete and immediately runnable.

---

## Your Core Operating Rules

These rules are non-negotiable. Follow them on every single response.

### 1. One file per response
Write exactly one complete file per response. No partial code. No truncation. The file must be ready to paste into the project and work without edits.

### 2. Always show the file path as a heading
Start every code block with the full path as a comment on line 1:

```js
// src/api/products.js
```

### 3. End every response with this exact footer
```
---
✅ [filename] complete
📁 Next: [next filename]
Say "next" to continue or ask a question.
```

### 4. Never explain unless asked
Do not explain your code. Do not describe what you are about to do. Do not add preamble. Start with the code immediately. If the user asks "why did you do X?", then explain.

### 5. Never ask clarifying questions
All architectural decisions are already made in `docs/ai/prd.md`. If something is ambiguous, use the PRD decision. If the PRD is silent, use the most conventional React pattern and note it in a single inline comment.

### 6. No magic numbers, no inline styles
Use named constants for any repeated values. Use Tailwind classes only — never `style={{}}` props.

### 7. Complete error handling on every async function
Every `fetch` call must be wrapped in try/catch at the hook level. Errors surface as `error` state — never swallowed silently.

---

## The File Build Order

Work through files in this exact sequence. Do not skip. Do not reorder.

| # | File | Notes |
|---|---|---|
| 1 | Setup commands | List `npm create vite`, `npm install`, Tailwind init — no file to write |
| 2 | `src/api/products.js` | All fetch functions, AbortController signals |
| 3 | `src/context/FilterContext.jsx` | useReducer + URL query param sync |
| 4 | `src/hooks/useDebounce.js` | Generic debounce hook |
| 5 | `src/hooks/useCategories.js` | Fetch once, module-level cache |
| 6 | `src/hooks/useProducts.js` | Fetches products, applies client filters, returns uniqueBrands |
| 7 | `src/utils/filterUtils.js` | `applyClientFilters`, `formatPrice`, `renderStars` — pure functions |
| 8 | `src/components/common/Loader.jsx` | Skeleton grid with `animate-pulse` |
| 9 | `src/components/common/Pagination.jsx` | "Showing X–Y of Z" + prev/next |
| 10 | `src/components/common/ErrorBoundary.jsx` | React class component |
| 11 | `src/components/filters/CategoryFilter.jsx` | Radio buttons from categories array |
| 12 | `src/components/filters/PriceFilter.jsx` | Min/max number inputs |
| 13 | `src/components/filters/BrandFilter.jsx` | Checkboxes, multi-select |
| 14 | `src/components/filters/FilterPanel.jsx` | Sticky sidebar, Clear All button |
| 15 | `src/components/products/ProductCard.jsx` | React.memo, hover lift, lazy image |
| 16 | `src/components/products/ProductGrid.jsx` | Responsive grid, empty state |
| 17 | `src/pages/ListingPage.jsx` | Wires everything together |
| 18 | `src/pages/DetailPage.jsx` | Image gallery, back button = navigate(-1) |
| 19 | `src/App.jsx` | Routes only, FilterProvider wraps ListingPage |
| 20 | `src/main.jsx` | Entry point |
| 21 | `index.css` | Tailwind directives + any global overrides |
| 22 | `README.md` | Setup, assumptions, architecture, improvements |

---

## Architecture Decisions (Locked — Do Not Change)

### State management
- `FilterContext` with `useReducer` — no Redux, no Zustand
- Filter state shape:
  ```js
  {
    category: '',   // triggers server re-fetch
    minPrice: '',   // client-side filter
    maxPrice: '',   // client-side filter
    brands: [],     // client-side filter, multi-select
    page: 1,        // resets on any filter change
    limit: 20
  }
  ```

### URL sync (critical)
`FilterContext` must sync all filter values into URL query params on every state change using `navigate('?...', { replace: true })`. On mount, read URL params back into state. This is what makes the Back button preserve filters — do not skip this.

### Filtering strategy
| Filter | Where it runs | Why |
|---|---|---|
| Category | Server — calls `/products/category/{cat}` | DummyJSON supports it |
| Price range | Client — filter the fetched array | No server support |
| Brand | Client — filter the fetched array | No server support |

### AbortController
Every API function signature accepts a `signal` parameter:
```js
export const getProducts = async (limit, skip, signal) => { ... }
```
Every `useEffect` that fetches creates an `AbortController`, passes its `signal`, and calls `controller.abort()` in the cleanup function.

### Performance
- `React.memo` on `ProductCard` — prevents re-render when filter state updates
- `useDebounce(300)` on price inputs — no fetch on every keystroke
- `loading="lazy"` on every `<img>`
- Categories fetched once; cache result in module scope outside the hook

### Routing
```
/             → redirect to /products
/products     → ListingPage (wrapped in FilterProvider)
/product/:id  → DetailPage (no FilterProvider needed)
```

---

## Coding Standards

### Naming conventions
- Components: `PascalCase` — `ProductCard.jsx`
- Hooks: `camelCase` prefixed `use` — `useProducts.js`
- Utilities: `camelCase` — `filterUtils.js`
- Constants: `UPPER_SNAKE_CASE` — `const API_BASE = 'https://dummyjson.com'`
- Event handlers: `handle` prefix — `handleCategoryChange`

### Component rules
- One responsibility per component
- Max ~150 lines per file — split if longer
- No API calls inside components — always use a hook
- No business logic inside JSX — extract to a function above the return

### What clean code looks like in this project
```jsx
// Good — logic extracted, JSX is declarative
const isEmpty = !loading && products.length === 0;
return isEmpty ? <EmptyState onReset={handleReset} /> : <ProductGrid products={products} />;

// Bad — logic inside JSX
return !loading && products.length === 0
  ? <div onClick={() => dispatch({ type: 'RESET' })}>No results</div>
  : <div>{products.map(...)}</div>;
```

---

## How to Resume After a Context Limit

If this conversation ends before the project is complete, start a new conversation with this prompt:

```
Continue my Leegality React assessment. Read docs/ai/prd.md and docs/ai/agent.md for full context.

Rules:
- One complete file per response
- Footer: ✅ [file] done / 📁 Next: [file] / Say "next" to continue
- No explanations unless asked
- No truncation

Files already written: [LIST COMPLETED FILES]
Next file to write: [NEXT FILE FROM THE BUILD ORDER]

Write it now, complete.
```

---

## How to Handle Common Situations

### "The file is too long to write in one response"
Split is not allowed for a single file. Increase density — remove blank lines between imports, write concise JSX. If a component genuinely exceeds ~200 lines, flag it and ask the user if they want it split into sub-components first.

### "I'm not sure which Tailwind class to use"
Use the simplest correct class. Do not invent class names. Stick to Tailwind core utilities only — no arbitrary values like `w-[347px]` unless absolutely necessary.

### "The PRD and this file contradict each other"
This file (`agent.md`) takes precedence on process rules. `prd.md` takes precedence on feature requirements and architecture decisions.

### "The user asks for a feature not in the PRD"
Implement it. Note it briefly at the bottom of the response as `// Added: [feature description]` so the user knows it was an addition.

---

## Definition of Done

The project is complete when all 22 items in the build order are written AND the following checklist passes:

- [ ] `npm run dev` starts without errors
- [ ] Products load on `/products`
- [ ] Clicking a category filter re-fetches from the correct API endpoint
- [ ] Price and brand filters update the list without a new API call
- [ ] Pagination shows correct "Showing X–Y of Z" and resets on filter change
- [ ] Clicking a product navigates to `/product/:id`
- [ ] Back button on detail page returns to listing with all filters still applied
- [ ] Loading skeleton shows during every fetch
- [ ] API errors show an error message with a retry option
- [ ] No console errors or React warnings in browser devtools
- [ ] `README.md` is filled out with real assumptions and architecture notes
