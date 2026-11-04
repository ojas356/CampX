import React from 'react';
import { getProductIllustration } from '../utils/productIllustrations.js';

export default function ProductCard({ product, onSelect }) {
  const isSecondHand = product.condition === 'Second-hand' || product.condition === 'SECOND_HAND';
  const conditionLabel = isSecondHand ? 'Second-hand' : 'New';
  const sellerName = product.seller?.name || 'APSIT Student';
  const imageSrc = getProductIllustration(product);

  return (
    <article
      className="product-card"
      onClick={() => onSelect(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(product);
        }
      }}
      aria-label={`View details for ${product.productName}`}
    >
      {/* Claymorphic Media Well */}
      <div className="product-card-media">
        <img
          src={imageSrc}
          alt={product.productName}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {product.status === 'SOLD' && (
          <div className="absolute inset-0 bg-[#2c2115]/65 backdrop-blur-xs flex items-center justify-center">
            <span className="tag tag-sold text-sm uppercase tracking-wider px-3 py-1 rotate-[-5deg] shadow-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Index Card Body */}
      <div className="product-card-body">
        <div>
          <div className="product-card-top">
            <span className="font-semibold text-[#5a4a34]">
              {product.category} · {conditionLabel}
            </span>
            <span className="product-price">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          </div>

          <h3 className="product-title line-clamp-2">{product.productName}</h3>

          <p className="product-meta mt-1">
            Pickup: {product.location?.split(' or ')[0] || 'APSIT Campus'}
          </p>
          <p className="product-seller">
            Pinned by <strong className="text-[#2c2115]">{sellerName}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
          className="btn btn-outline btn-sm btn-show-more mt-3"
        >
          Inspect Index Card
        </button>
      </div>
    </article>
  );
}
