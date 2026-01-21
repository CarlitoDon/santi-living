/**
 * CartItem Component - matches original Calculator.astro styling
 */

import type { Product } from "./types";
import "./styles.css";

interface CartItemProps {
  product: Product;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  optimizedImage?: string;
}

export function CartItem({
  product,
  quantity,
  onIncrement,
  onDecrement,
  optimizedImage,
}: CartItemProps) {
  const isSelected = quantity > 0;

  return (
    <div className={`calc-cart-item ${isSelected ? "selected" : ""}`}>
      {/* Thumbnail + Info */}
      <img
        src={optimizedImage || product.image}
        alt={product.shortName}
        className="calc-cart-item-thumb"
        loading="lazy"
      />

      <div className="calc-cart-item-info">
        <span className="calc-cart-item-name">{product.shortName}</span>
        {product.dimensions && (
          <span className="calc-cart-item-dimensions">
            {product.dimensions}
          </span>
        )}
        <span className="calc-cart-item-price">
          Rp {new Intl.NumberFormat("id-ID").format(product.pricePerDay)}/hari
        </span>
      </div>

      {/* Stepper controls */}
      <div className="calc-cart-item-controls">
        <button
          type="button"
          onClick={onDecrement}
          disabled={quantity === 0}
          className="calc-btn-stepper"
        >
          −
        </button>
        <span className="calc-cart-item-qty">{quantity}</span>
        <button
          type="button"
          onClick={onIncrement}
          className="calc-btn-stepper"
        >
          +
        </button>
      </div>
    </div>
  );
}
