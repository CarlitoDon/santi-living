import React, { useState, useEffect, useCallback } from "react";
import { useStore } from "@nanostores/react";
import {
  isModalOpen,
  modalProduct,
  modalQuantityGetter,
  closeModal,
  dispatchModalIncrement,
  dispatchModalDecrement,
} from "@/store/modalStore";
import { formatCurrency } from "@/lib/format";

export const ProductModal: React.FC = () => {
  const isOpen = useStore(isModalOpen);
  const product = useStore(modalProduct);
  const getQuantity = useStore(modalQuantityGetter);
  const [quantity, setQuantity] = useState(0);

  // Update quantity when modal opens or when quantity changes
  useEffect(() => {
    if (isOpen && getQuantity) {
      setQuantity(getQuantity());
    }
  }, [isOpen, getQuantity]);

  // Listen for quantity updates from Calculator
  useEffect(() => {
    const handleQuantityUpdate = () => {
      if (getQuantity) {
        setQuantity(getQuantity());
      }
    };

    window.addEventListener("modal-quantity-updated", handleQuantityUpdate);
    return () => {
      window.removeEventListener(
        "modal-quantity-updated",
        handleQuantityUpdate,
      );
    };
  }, [getQuantity]);

  const handleIncrement = useCallback(() => {
    if (product) {
      dispatchModalIncrement(product.id);
      // Optimistically update local state
      setQuantity((prev) => prev + 1);
    }
  }, [product]);

  const handleDecrement = useCallback(() => {
    if (product && quantity > 0) {
      dispatchModalDecrement(product.id);
      // Optimistically update local state
      setQuantity((prev) => Math.max(0, prev - 1));
    }
  }, [product, quantity]);

  if (!isOpen || !product) return null;

  return (
    <div className={`modal ${isOpen ? "active" : ""}`} id="productModal">
      <div className="modal-overlay" onClick={closeModal} />
      <div className="modal-content">
        <button className="modal-close" onClick={closeModal}>
          &times;
        </button>

        <div className="modal-body">
          <div className="modal-image-container">
            <img
              src={product.image}
              alt={product.name}
              className="modal-image"
              id="modalImage"
            />
          </div>

          <div className="modal-details">
            <h3 className="modal-title" id="modalTitle">
              {product.name}
            </h3>

            <div className="modal-meta">
              {product.dimensions && (
                <span className="modal-tag" id="modalDimensions">
                  {product.dimensions}
                </span>
              )}
              {product.capacity && (
                <span className="modal-tag" id="modalCapacity">
                  {product.capacity}
                </span>
              )}
            </div>

            <p className="modal-description" id="modalDescription">
              {product.description}
            </p>

            <div className="modal-price-container">
              <span className="modal-price-label">Harga Sewa</span>
              <span className="modal-price" id="modalPrice">
                Rp {formatCurrency(product.pricePerDay)}/hari
              </span>
            </div>

            {/* Stepper Controls */}
            <div className="modal-stepper">
              <span className="modal-stepper-label">Jumlah:</span>
              <div className="modal-stepper-controls">
                <button
                  type="button"
                  className="modal-btn-stepper"
                  onClick={handleDecrement}
                  disabled={quantity === 0}
                >
                  −
                </button>
                <span className="modal-stepper-qty">{quantity}</span>
                <button
                  type="button"
                  className="modal-btn-stepper"
                  onClick={handleIncrement}
                >
                  +
                </button>
              </div>
            </div>

            <button className="btn btn-primary btn-block" onClick={closeModal}>
              Tutup
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          display: flex;
        }
        
        .modal.active {
          opacity: 1;
          visibility: visible;
        }

        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }

        .modal-content {
          position: relative;
          background: var(--color-surface);
          width: 90%;
          max-width: 800px;
          margin: auto;
          border-radius: var(--radius-lg);
          padding: 0;
          box-shadow: var(--shadow-xl);
          transform: translateY(20px);
          transition: transform 0.3s ease;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal.active .modal-content {
          transform: translateY(0);
        }

        .modal-close {
          position: absolute;
          top: var(--space-4);
          right: var(--space-4);
          background: rgba(0, 0, 0, 0.1);
          border: none;
          font-size: var(--font-size-2xl);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--color-text);
          z-index: 10;
          transition: background 0.2s;
        }

        .modal-close:hover {
          background: rgba(0, 0, 0, 0.2);
        }

        /* Modal Body Layout */
        .modal-body {
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 768px) {
          .modal-body {
            flex-direction: row;
          }
          
          .modal-image-container {
            width: 50%;
            height: auto;
            min-height: 400px;
          }
          
          .modal-details {
            width: 50%;
            padding: var(--space-8);
          }
        }

        .modal-image-container {
          width: 100%;
          height: 250px;
          background: var(--color-surface-elevated);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .modal-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-details {
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
        }

        .modal-title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          margin-bottom: var(--space-3);
          color: var(--color-text);
        }

        .modal-meta {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
        }

        .modal-tag {
          background: var(--color-background);
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-full);
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          border: 1px solid var(--color-border);
        }

        .modal-description {
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin-bottom: var(--space-4);
        }

        .modal-price-container {
          margin-bottom: var(--space-4);
        }

        .modal-price-label {
          display: block;
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          margin-bottom: var(--space-1);
        }

        .modal-price {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-primary);
        }

        /* Stepper Styles */
        .modal-stepper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--color-surface-elevated);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-4);
        }

        .modal-stepper-label {
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
        }

        .modal-stepper-controls {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          background: var(--color-background);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
        }

        .modal-btn-stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: var(--color-primary-light, #dbeafe);
          border: 1px solid var(--color-primary);
          border-radius: 0.25rem;
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--color-primary);
          cursor: pointer;
          transition: all 0.15s ease;
          padding: 0;
        }

        .modal-btn-stepper:hover:not(:disabled) {
          background: var(--color-primary);
          color: white;
        }

        .modal-btn-stepper:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .modal-stepper-qty {
          min-width: 2rem;
          text-align: center;
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-lg);
        }
      `}</style>
    </div>
  );
};
