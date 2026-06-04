import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { FilterProvider } from './context/FilterContext';
import DetailPage from './pages/DetailPage';
import ListingPage from './pages/ListingPage';

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/products" replace />} />
    <Route
      path="/products"
      element={
        <FilterProvider>
          <ListingPage />
        </FilterProvider>
      }
    />
    <Route path="/product/:id" element={<DetailPage />} />
  </Routes>
);

export default App;
