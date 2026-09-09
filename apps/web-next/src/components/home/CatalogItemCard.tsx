import type { ReactNode } from 'react';

type CatalogItemCardProps = {
  title: string;
  meta?: string;
  price?: ReactNode;
  thumbnail: ReactNode;
  thumbnailAlt?: string;
  action: ReactNode;
  onDetail?: () => void;
  productId?: string;
};

export function CatalogItemCard({
  title,
  meta,
  price,
  thumbnail,
  thumbnailAlt,
  action,
  onDetail,
  productId,
}: CatalogItemCardProps) {
  const details = (
    <>
      <p className="product-picker-name">{title}</p>
      {meta ? <p className="product-picker-dim">{meta}</p> : null}
      {price ? <p className="product-picker-price">{price}</p> : null}
    </>
  );

  return (
    <div className="product-picker-card" data-product-id={productId}>
      {onDetail ? (
        <button type="button" onClick={onDetail} className="product-picker-thumb" aria-label={`Detail ${title}`}>
          {thumbnail}
        </button>
      ) : (
        <div
          className="product-picker-thumb product-picker-thumb-static"
          aria-label={thumbnailAlt || undefined}
          role={thumbnailAlt ? 'img' : undefined}
        >
          {thumbnail}
        </div>
      )}

      {onDetail ? (
        <button type="button" onClick={onDetail} className="product-picker-info product-picker-info-button">
          {details}
        </button>
      ) : (
        <div className="product-picker-info">{details}</div>
      )}

      <div className="product-picker-stepper">{action}</div>
    </div>
  );
}
