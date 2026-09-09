import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { getWhatsAppUrl } from '@/utils/whatsapp';

type WhatsAppLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'target' | 'rel'
> & {
  message?: string;
  source: string;
  location?: string;
  children: ReactNode;
};

/** Keeps WhatsApp links consistent and preserves their attribution metadata. */
export function WhatsAppLink({
  message,
  source,
  location,
  children,
  ...props
}: WhatsAppLinkProps) {
  return (
    <a
      {...props}
      href={getWhatsAppUrl(message, source)}
      target="_blank"
      rel="noopener noreferrer"
      data-wa-source={source}
      {...(location ? { 'data-wa-location': location } : {})}
    >
      {children}
    </a>
  );
}
