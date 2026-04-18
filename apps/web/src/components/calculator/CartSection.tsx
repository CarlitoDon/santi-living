/**
 * CartSection Component - matches original Calculator.astro styling
 */

import { useState, useEffect } from "react";
import type { Product } from "./types";
import type { CalculatorActions } from "./useCalculatorState";
import { CartItem } from "./CartItem";
import "./styles.css";

interface CartSectionProps {
  products: {
    mattressPackages: Product[];
    mattressOnly: Product[];
    accessories: Product[];
  };
  imageMap: Record<string, string>;
  imageMapLarge: Record<string, string>;
  actions: CalculatorActions;
  error?: string;
}

interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  color?: "primary" | "secondary" | "accent";
  items: Product[];
  imageMap: Record<string, string>;
  imageMapLarge: Record<string, string>;
  getItemQuantity: (id: string) => number;
  onAdd: (product: Product) => void;
  onRemove: (id: string) => void;
  initialVisibleCount?: number;
  showMoreLabel?: string;
}

function Accordion({
  title,
  defaultOpen = false,
  color = "secondary",
  items,
  imageMap,
  imageMapLarge,
  getItemQuantity,
  onAdd,
  onRemove,
  initialVisibleCount = 2,
  showMoreLabel,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showAll, setShowAll] = useState(false);

  const hasHiddenItems = items.length > initialVisibleCount;
  const visibleItems = showAll ? items : items.slice(0, initialVisibleCount);

  // Listen for deep link expand event
  useEffect(() => {
    const handleExpand = (event: CustomEvent<{ productId: string }>) => {
      const { productId } = event.detail;
      const hasProduct = items.some((p) => p.id === productId);
      if (hasProduct) {
        setIsOpen(true);
        setShowAll(true);
      }
    };

    window.addEventListener(
      "expand-product-accordion",
      handleExpand as EventListener,
    );
    return () => {
      window.removeEventListener(
        "expand-product-accordion",
        handleExpand as EventListener,
      );
    };
  }, [items]);

  return (
    <div className={`calc-accordion ${isOpen ? "active" : ""}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="calc-accordion-header"
      >
        <span className={`calc-accordion-title ${color}`}>{title}</span>
        <span className="calc-accordion-icon">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div className="calc-accordion-content">
          {visibleItems.map((product) => (
            <CartItem
              key={product.id}
              product={product}
              quantity={getItemQuantity(product.id)}
              onIncrement={() => onAdd(product)}
              onDecrement={() => onRemove(product.id)}
              optimizedImage={imageMap[product.id]}
              largeImage={imageMapLarge[product.id]}
            />
          ))}
          {hasHiddenItems && showMoreLabel && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="calc-btn-show-more"
            >
              {showAll ? "Sembunyikan" : showMoreLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function CartSection({
  products,
  imageMap,
  imageMapLarge,
  actions,
  error,
}: CartSectionProps) {
  const { addItem, removeItem, getItemQuantity } = actions;

  const handleAdd = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      pricePerDay: product.pricePerDay,
      includes: product.includes,
    });
  };

  return (
    <div
      className={`calc-form-section ${error ? "error" : ""}`}
      style={
        error
          ? {
              border: "2px solid #ef4444",
              borderRadius: "0.5rem",
              padding: "1rem",
              background: "#fef2f2",
            }
          : {}
      }
    >
      {/* Section Header */}
      <div className="calc-section-header">
        <span className="calc-section-number">1</span>
        <span className="calc-section-title">Pilihan Item</span>
      </div>

      {error && (
        <p className="calc-error-message" style={{ marginBottom: "0.75rem" }}>
          {error}
        </p>
      )}

      {/* Mattress Packages */}
      <Accordion
        title="Paket Kasur (Kasur + Bantal + Selimut)"
        defaultOpen
        color="primary"
        items={products.mattressPackages}
        imageMap={imageMap}
        imageMapLarge={imageMapLarge}
        getItemQuantity={getItemQuantity}
        onAdd={handleAdd}
        onRemove={removeItem}
        initialVisibleCount={2}
        showMoreLabel="Lihat Ukuran Lainnya"
      />

      {/* Mattress Only */}
      <Accordion
        title="Kasur Saja"
        color="secondary"
        items={products.mattressOnly}
        imageMap={imageMap}
        imageMapLarge={imageMapLarge}
        getItemQuantity={getItemQuantity}
        onAdd={handleAdd}
        onRemove={removeItem}
        initialVisibleCount={2}
        showMoreLabel="Lihat Ukuran Lainnya"
      />

      {/* Accessories - show all items (no showMore button) */}
      <Accordion
        title="Ekstra Tambahan Satuan"
        color="accent"
        items={products.accessories}
        imageMap={imageMap}
        imageMapLarge={imageMapLarge}
        getItemQuantity={getItemQuantity}
        onAdd={handleAdd}
        onRemove={removeItem}
        initialVisibleCount={100}
      />

      {/* Total Items */}
      <div className="calc-cart-total">
        <span className="calc-cart-total-label">Total Item:</span>
        <span className="calc-cart-total-value">
          {actions.state.totalQuantity} unit
        </span>
      </div>
    </div>
  );
}
