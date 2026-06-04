// src/pages/DetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../api/products';
import Loader from '../components/common/Loader';
import { formatPrice, renderStars } from '../utils/filterUtils';

const PAGE_CLASSES = 'mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8';
const CARD_CLASSES = 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm';
const GRID_CLASSES = 'grid gap-10 lg:grid-cols-[1.1fr_1fr]';
const GALLERY_CLASSES = 'space-y-6';
const THUMB_ROW = 'flex flex-wrap gap-3';
const THUMB_CLASSES =
  'h-16 w-16 rounded-lg border border-slate-200 object-cover';
const TITLE_CLASSES = 'text-2xl font-semibold text-slate-900';
const PRICE_CLASSES = 'mt-2 text-2xl font-semibold text-slate-900';
const META_CLASSES = 'mt-2 text-sm text-slate-600';
const DESCRIPTION_CLASSES = 'mt-4 text-sm text-slate-700 leading-relaxed';
const SECTION_TITLE = 'mt-6 text-lg font-semibold text-slate-900';
const BUTTON_CLASSES =
  'inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100';
const ERROR_CARD_CLASSES =
  'rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(id, controller.signal);
        if (!isActive) return;
        setProduct(data);
      } catch (err) {
        if (!isActive) return;
        if (err.name === 'AbortError') return;
        setError(err);
        setProduct(null);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [id]);

  if (loading) {
    return (
      <div className={PAGE_CLASSES}>
        <Loader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={PAGE_CLASSES}>
        <div className={ERROR_CARD_CLASSES}>
          Product not found. Please go back.
        </div>
        <button type="button" className={`${BUTTON_CLASSES} mt-4`} onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className={PAGE_CLASSES}>
      <button type="button" className={BUTTON_CLASSES} onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className={`mt-6 ${CARD_CLASSES}`}>
        <div className={GRID_CLASSES}>
          <div className={GALLERY_CLASSES}>
            <img
              src={product.thumbnail}
              alt={product.title}
              loading="lazy"
              className="w-full rounded-xl border border-slate-200 object-cover"
            />
            <div className={THUMB_ROW}>
              {(product.images || []).map((image) => (
                <img
                  key={image}
                  src={image}
                  alt={product.title}
                  loading="lazy"
                  className={THUMB_CLASSES}
                />
              ))}
            </div>
          </div>
          <div>
            <h1 className={TITLE_CLASSES}>{product.title}</h1>
            <div className="mt-2 flex items-center gap-3">
              <p className={PRICE_CLASSES}>{formatPrice(product.price)}</p>
              <div className="flex items-center gap-1 text-sm text-amber-500">
                {renderStars(product.rating)}
                <span className="text-xs text-slate-500">
                  ({Number(product.rating || 0).toFixed(1)})
                </span>
              </div>
            </div>
            <p className={META_CLASSES}>Brand: {product.brand}</p>
            <p className={META_CLASSES}>Category: {product.category}</p>
            <h2 className={SECTION_TITLE}>Description</h2>
            <p className={DESCRIPTION_CLASSES}>{product.description}</p>
            <h2 className={SECTION_TITLE}>Reviews</h2>
            <div className="mt-3 space-y-4">
              <div className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-slate-800">Emily</p>
                  <span className="text-sm text-amber-500">★★★★★</span>
                  <span className="text-xs text-slate-500">(4.0)</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Excellent phone with great camera and battery life. Highly recommended!
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-slate-800">John</p>
                  <span className="text-sm text-amber-500">★★★★☆</span>
                  <span className="text-xs text-slate-500">(4.0)</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Very satisfied with the performance and features. It's a great value for the money.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
