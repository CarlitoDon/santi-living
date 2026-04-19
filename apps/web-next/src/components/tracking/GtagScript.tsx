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

          // --- DEVELOPER MODE FLAG ---
          if (typeof window !== "undefined") {
            if (localStorage.getItem("developer_mode") === "true") {
              window["ga-disable-${GA_MEASUREMENT_ID}"] = true;
              window["ga-disable-${ADS_ID}"] = true;
              console.log("🛠️ Developer Mode Active: Google Analytics & Ads tracking disabled.");
            }
            // Helpers to toggle in console
            window.enableDevMode = function() { localStorage.setItem("developer_mode", "true"); console.log("Dev mode enabled. Reloading..."); location.reload(); };
            window.disableDevMode = function() { localStorage.removeItem("developer_mode"); console.log("Dev mode disabled. Reloading..."); location.reload(); };
          }

          function getOrCreateGaUserId() {
            if (typeof window === "undefined") return "";
            var storageKey = "sl_ga_user_id";
            var existing = localStorage.getItem(storageKey);
            if (existing) return existing;

            var generated;
            if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
              generated = crypto.randomUUID();
            } else {
              generated = "sl-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
            }

            localStorage.setItem(storageKey, generated);
            return generated;
          }

          var gaUserId = getOrCreateGaUserId();

          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            'user_id': gaUserId,
            'allow_google_signals': true,
            'allow_ad_personalization_signals': true
          });
          gtag('config', '${ADS_ID}', {
            'user_id': gaUserId
          });
        `}
      </Script>
      <Script id="wa-conversion-tracker" strategy="afterInteractive">
        {`
          document.addEventListener('click', function(e) {
            var target = e.target;
            var link = target.closest('a[href*="wa.me"], a[href*="whatsapp"]');
            if (link) {
              var source = link.getAttribute('data-wa-source') || 'unknown';
              gtag('event', 'whatsapp_click', {
                'event_category': 'engagement',
                'event_label': source,
                'transport_type': 'beacon'
              });
              gtag('event', 'conversion', {
                'send_to': '${ADS_ID}/whatsapp_lead'
              });
            }
            var telLink = target.closest('a[href^="tel:"]');
            if (telLink) {
              gtag('event', 'phone_click', {
                'event_category': 'engagement',
                'transport_type': 'beacon'
              });
              gtag('event', 'conversion', {
                'send_to': '${ADS_ID}/phone_lead'
              });
            }
          });
        `}
      </Script>
    </>
  );
}
