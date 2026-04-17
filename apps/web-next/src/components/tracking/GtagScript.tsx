import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-MLNE098NSZ';
const ADS_ID = 'AW-17865321955';

export function GtagScript() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
          gtag('config', '${ADS_ID}');
        `}
      </Script>
      <Script id="wa-conversion-tracker" strategy="afterInteractive">
        {`
          document.addEventListener('click', function(e) {
            var link = e.target.closest('a[href*="wa.me"], a[href*="whatsapp"]');
            if (link) {
              gtag('event', 'whatsapp_click', {
                event_category: 'engagement',
                event_label: link.dataset.waSource || 'unknown',
                transport_type: 'beacon'
              });
              gtag('event', 'conversion', {
                send_to: '${ADS_ID}/whatsapp_lead'
              });
            }
            var telLink = e.target.closest('a[href^="tel:"]');
            if (telLink) {
              gtag('event', 'phone_click', {
                event_category: 'engagement',
                transport_type: 'beacon'
              });
              gtag('event', 'conversion', {
                send_to: '${ADS_ID}/phone_lead'
              });
            }
          });
        `}
      </Script>
    </>
  );
}
