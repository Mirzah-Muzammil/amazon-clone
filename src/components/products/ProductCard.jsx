import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, renderStars } from '../../utils/filterUtils';

const CARD_CLASSES =
  'group flex h-full cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md';
const IMAGE_WRAPPER =
  'relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-white';
const IMAGE_CLASSES = 'h-full w-full object-contain';
const TITLE_CLASSES = 'line-clamp-1 text-base font-semibold text-slate-900';
const PRICE_ROW = 'mt-2 flex items-center justify-between';
const PRICE_CLASSES = 'text-lg font-semibold text-slate-900';
const RATING_ROW = 'flex items-center gap-1 text-sm text-amber-500';
const RATING_TEXT = 'text-xs text-slate-500';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <article className={CARD_CLASSES} onClick={handleClick}>
      <div className={IMAGE_WRAPPER}>
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className={IMAGE_CLASSES}
        />
      </div>
      <h3 className={TITLE_CLASSES}>{product.title}</h3>
      <div className={PRICE_ROW}>
        <p className={PRICE_CLASSES}>{formatPrice(product.price)}</p>
        <span className={RATING_ROW}>
          {renderStars(product.rating)}
          <span className={RATING_TEXT}>
            ({Number(product.rating || 0).toFixed(1)})
          </span>
        </span>
      </div>
    </article>
  );
};

export default React.memo(ProductCard);
