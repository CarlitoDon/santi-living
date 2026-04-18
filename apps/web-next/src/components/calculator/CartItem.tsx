/**
 * CartItem Component - matches original Calculator.astro styling
 */

import type { Product } from "./types";
import type { ProductItem } from "@/types";
import "./styles.css";

interface CartItemProps {
  product: Product;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  optimizedImage?: string;
  largeImage?: string;
}

export function CartItem({
  product,
  quantity,
  onIncrement,
  onDecrement,
  optimizedImage,
  largeImage,
}: CartItemProps) {
  const isSelected = quantity > 0;

  const handleImageClick = () => {
    // Convert Product to ProductItem format for modal
    // Use large optimized image for modal display
    const modalProduct: ProductItem = {
      id: product.id,
      name: product.name,
      shortName: product.shortName,
      description: product.description || "",
      dimensions: product.dimensions,
      capacity: product.capacity,
      pricePerDay: product.pricePerDay,
      image: largeImage || optimizedImage || product.image,
      includes: product.includes,
    };
    window.dispatchEvent(new CustomEvent('open-calculator-modal', { detail: modalProduct }));
  };

  return (
    <div
      className={`calc-cart-item ${isSelected ? "selected" : ""}`}
      data-product-id={product.id}
    >
      {/* Thumbnail + Info - clickable to open modal */}
      {/* eslint-disable-next-line @next/next/no-img-element -- dynamic product images from various sources */}
      <img
        src={optimizedImage || product.image}
        alt={product.shortName}
        className="calc-cart-item-thumb"
        loading="lazy"
        onClick={handleImageClick}
        style={{ cursor: "pointer" }}
        title="Klik untuk melihat detail"
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
