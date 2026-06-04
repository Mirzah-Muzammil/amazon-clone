# Leegality Frontend Assessment

## Setup
```bash
npm install
npm run dev
```

## Final checks
```bash
npm run dev
```

## Assumptions
- Price filtering is client-side because the API does not support price range queries.
- Brand options are derived from the fetched product list.
- Pagination resets on any filter change to prevent empty pages.

## Architecture
- Filter state is centralized in `FilterContext` with URL query sync.
- API calls live in `src/api/products.js`.
- Category filtering is server-side; price and brand filters are client-side.

## Improvements (given more time)
- Sorting by price and rating.
- Cart and wishlist flows.
- Skeleton shimmer animation polish.
- Unit tests with React Testing Library.
- Storybook for component documentation.
# amazon-clone
