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
            'allow_ad_personalization_signals': true,
            'cookie_flags': 'SameSite=None;Secure'
          });
          gtag('config', '${ADS_ID}', {
            'user_id': gaUserId,
            'cookie_flags': 'SameSite=None;Secure'
          });
        `}
      </Script>
      <Script id="wa-conversion-tracker" strategy="afterInteractive">
        {`
          document.addEventListener('click', function(e) {
            var target = e.target;
            var link = target.closest('a[href*="wa.me"], a[href*="whatsapp"]');
            if (link) {
              var ctaSource = link.getAttribute('data-wa-source') || 'unknown';
              var ctaLocation = link.getAttribute('data-wa-location') || '';

              // Read persisted attribution from localStorage
              var attr = {};
              try {
                var raw = localStorage.getItem('sl_attribution_v1');
                if (raw) {
                  var parsed = JSON.parse(raw);
                  var t = parsed.last || {};
                  attr = {
                    utm_source: t.source || '',
                    utm_medium: t.medium || '',
                    utm_campaign: t.campaign || '',
                    gclid: t.gclid || '',
                    gbraid: t.gbraid || '',
                    wbraid: t.wbraid || ''
                  };
                }
              } catch(ex) {}

              // Build event params with full attribution
              var eventParams = {
                'event_category': 'engagement',
                'event_label': ctaSource,
                'cta_source': ctaSource,
                'cta_location': ctaLocation,
                'page_location': window.location.href,
                'page_path': window.location.pathname,
                'page_referrer': document.referrer || '',
                'link_url': link.href,
                'utm_source': attr.utm_source || '',
                'utm_medium': attr.utm_medium || '',
                'utm_campaign': attr.utm_campaign || '',
                'gclid': attr.gclid || '',
                'gbraid': attr.gbraid || '',
                'wbraid': attr.wbraid || '',
                'transport_type': 'beacon'
              };

              gtag('event', 'whatsapp_click', eventParams);

              // Google Ads conversion
              gtag('event', 'conversion', {
                'send_to': '${ADS_ID}/y7bwCKTm3J0cEOPb7MZC'
              });

              // --- Client-side attribution enrichment ---
              // Compute attribution code (same logic as whatsapp.ts getAttributionTag)
              var attrCode = '';
              try {
                var src = (attr.utm_source || '').toLowerCase();
                var med = (attr.utm_medium || '').toLowerCase();
                if (attr.gclid || (src === 'google' && med === 'cpc')) attrCode = 'g/cpc';
                else if (attr.gbraid) attrCode = 'g/cpc-b';
                else if (src === 'google' && med === 'organic') attrCode = 'g/org';
                else if (src.indexOf('google') !== -1 && med === 'organic') attrCode = 'gbp';
                else if (src.indexOf('instagram') !== -1 || src.indexOf('ig') !== -1) attrCode = 'ig';
                else if (src.indexOf('facebook') !== -1 || src.indexOf('fb') !== -1) attrCode = 'fb';
                else if (src.indexOf('tiktok') !== -1) attrCode = 'tt';
                else if (med === 'referral') attrCode = 'ref';
                else if (src === '(direct)' || src === '(none)') attrCode = 'dir';
                else if (src) attrCode = src.slice(0, 6);
              } catch(ex) {}

              if (attrCode) {
                try {
                  var url = new URL(link.href);
                  var textParam = url.searchParams.get('text') || '';
                  // Only enrich if [W:...] tag exists and doesn't already have attribution
                  var tagMatch = textParam.match(/\\[W:([^\\]]+)\\]/);
                  if (tagMatch && tagMatch[1].indexOf('/') === -1) {
                    var oldTag = tagMatch[0];
                    var newTag = '[W:' + tagMatch[1] + '/' + attrCode + ']';
                    textParam = textParam.replace(oldTag, newTag);
                    url.searchParams.set('text', textParam);
                    link.href = url.toString();
                  }
                } catch(ex) {}
              }
            }
            var telLink = target.closest('a[href^="tel:"]');
            if (telLink) {
              gtag('event', 'phone_click', {
                'event_category': 'engagement',
                'transport_type': 'beacon'
              });
            }
          });
        `}
      </Script>
    </>
  );
}
