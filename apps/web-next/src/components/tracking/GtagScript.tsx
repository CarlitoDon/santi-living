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
          function getWaAttributionCode(attr) {
            try {
              var src = (attr.utm_source || '').toLowerCase();
              var med = (attr.utm_medium || '').toLowerCase();
              if (attr.gclid || (src === 'google' && med === 'cpc')) return 'g/cpc';
              if (attr.gbraid) return 'g/cpc-b';
              if (attr.wbraid) return 'g/cpc-w';
              if (src === 'google' && med === 'organic') return 'g/org';
              if (src.indexOf('google_business_profile') !== -1) return 'gbp';
              if (src.indexOf('google') !== -1 && med === 'organic') return 'gbp';
              if (src.indexOf('instagram') !== -1 || src.indexOf('ig') !== -1) return 'ig';
              if (src.indexOf('facebook') !== -1 || src.indexOf('fb') !== -1) return 'fb';
              if (src.indexOf('tiktok') !== -1) return 'tt';
              if (med === 'referral') return 'ref';
              if (src === '(direct)' || src === '(none)') return 'dir';
              return src ? src.slice(0, 6) : '';
            } catch(ex) {
              return '';
            }
          }

          function createLeadEventId() {
            try {
              if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
                return crypto.randomUUID();
              }
            } catch(ex) {}
            return 'lead-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
          }

          function trackGtagEvent() {
            try {
              if (typeof gtag === 'function') {
                gtag.apply(null, arguments);
              }
            } catch(ex) {}
          }

          function sendLeadEvent(payload) {
            try {
              var body = JSON.stringify(payload);
              if (navigator.sendBeacon) {
                navigator.sendBeacon('/api/lead/track', new Blob([body], { type: 'application/json' }));
                return;
              }
              fetch('/api/lead/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body,
                keepalive: true
              }).catch(function() {});
            } catch(ex) {}
          }

          function requestLeadLocation(callback) {
            try {
              if (!navigator.geolocation) {
                callback({ location_permission: 'unsupported' });
                return;
              }

              var settled = false;
              var watchdog = setTimeout(function() {
                finish({ location_permission: 'timeout' });
              }, 11500);

              function finish(location) {
                if (settled) return;
                settled = true;
                clearTimeout(watchdog);
                callback(location || { location_permission: 'error' });
              }

              navigator.geolocation.getCurrentPosition(
                function(position) {
                  finish({
                    location_permission: 'granted',
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    location_accuracy_m: position.coords.accuracy
                  });
                },
                function(error) {
                  var status = 'unavailable';
                  if (error && error.code === 1) status = 'denied';
                  if (error && error.code === 3) status = 'timeout';
                  finish({ location_permission: status });
                },
                {
                  enableHighAccuracy: true,
                  timeout: 10000,
                  maximumAge: 0
                }
              );
            } catch(ex) {
              callback({ location_permission: 'error' });
            }
          }

          function compactAddressParts(parts) {
            var seen = {};
            var output = [];
            for (var i = 0; i < parts.length; i++) {
              var value = String(parts[i] || '').trim();
              if (!value) continue;
              var key = value.toLowerCase();
              if (seen[key]) continue;
              seen[key] = true;
              output.push(value);
            }
            return output.join(', ');
          }

          function readCachedAutoLocation() {
            try {
              var raw = sessionStorage.getItem('sl_auto_location_result');
              if (!raw) return null;
              var parsed = JSON.parse(raw);
              if (!parsed || !parsed.coords || !parsed.address) return null;
              if (typeof parsed.coords.lat !== 'number' || typeof parsed.coords.lng !== 'number') return null;

              var address = parsed.address || {};
              return {
                location_permission: 'cached',
                latitude: parsed.coords.lat,
                longitude: parsed.coords.lng,
                address_text: compactAddressParts([
                  address.street,
                  address.kelurahan,
                  address.kecamatan,
                  address.kota,
                  address.provinsi,
                  address.postcode
                ]),
                city: address.kota || ''
              };
            } catch(ex) {
              return null;
            }
          }

          function normalizeAddressName(value) {
            return String(value || '')
              .toLowerCase()
              .replace(/^(kabupaten|kota|kecamatan|kelurahan|desa)\\s+/i, '')
              .replace(/\\s+/g, '')
              .trim();
          }

          function extractKelurahanFromDisplayName(displayName, kecamatanName) {
            var parts = String(displayName || '').split(',').map(function(part) {
              return part.trim();
            });
            var normalizedKecamatan = normalizeAddressName(kecamatanName);
            var kecamatanIndex = -1;

            for (var i = 0; i < parts.length; i++) {
              if (normalizeAddressName(parts[i]) === normalizedKecamatan) {
                kecamatanIndex = i;
                break;
              }
            }

            if (kecamatanIndex > 0) {
              var previous = parts[kecamatanIndex - 1];
              if (previous && normalizeAddressName(previous) !== normalizedKecamatan) return previous;
            }
            if (kecamatanIndex > 1) {
              var beforePrevious = parts[kecamatanIndex - 2];
              if (beforePrevious && normalizeAddressName(beforePrevious) !== normalizedKecamatan) return beforePrevious;
            }

            return '';
          }

          function formatReverseGeocodePayload(payload) {
            var address = payload && payload.address ? payload.address : {};
            var displayName = payload && payload.display_name ? payload.display_name : '';
            var road = address.road || '';
            var villageEqualsKecamatan =
              address.village &&
              address.municipality &&
              normalizeAddressName(address.village) === normalizeAddressName(address.municipality);
            var extractedKelurahan = villageEqualsKecamatan
              ? extractKelurahanFromDisplayName(displayName, address.municipality || '')
              : '';
            var kelurahan =
              address.suburb ||
              (villageEqualsKecamatan && extractedKelurahan ? extractedKelurahan : address.village) ||
              address.hamlet ||
              '';
            var kecamatan = address.city_district || address.municipality || '';
            var kota = address.county || address.city || address.town || '';
            var provinsi = address.state || 'DI Yogyakarta';
            var postcode = address.postcode || '';
            var street = road || address.neighbourhood || kelurahan || 'Area tidak diketahui';

            var fullAddress = compactAddressParts([
              street,
              road ? address.neighbourhood : '',
              kelurahan,
              kecamatan,
              kota,
              provinsi,
              postcode
            ]);

            return {
              fullAddress: fullAddress || displayName || '',
              street: street,
              kelurahan: kelurahan,
              kecamatan: kecamatan,
              kota: kota,
              provinsi: provinsi,
              postcode: postcode
            };
          }

          function reverseGeocodeLocation(location, callback) {
            if (location && location.address_text) {
              callback(location);
              return;
            }

            if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
              callback(location || {});
              return;
            }

            var completed = false;
            var timeout = setTimeout(function() {
              if (completed) return;
              completed = true;
              callback(location);
            }, 4500);

            fetch('/api/reverse-geocode?lat=' + encodeURIComponent(location.latitude) + '&lng=' + encodeURIComponent(location.longitude))
              .then(function(response) {
                if (!response.ok) throw new Error('reverse geocode failed');
                return response.json();
              })
              .then(function(payload) {
                if (completed) return;
                completed = true;
                clearTimeout(timeout);

                var formatted = formatReverseGeocodePayload(payload);
                var enrichedLocation = Object.assign({}, location, {
                  address_text: formatted.fullAddress,
                  city: formatted.kota || ''
                });

                try {
                  var detail = {
                    coords: { lat: location.latitude, lng: location.longitude },
                    address: {
                      street: formatted.street,
                      kelurahan: formatted.kelurahan,
                      kecamatan: formatted.kecamatan,
                      kota: formatted.kota,
                      provinsi: formatted.provinsi,
                      postcode: formatted.postcode
                    }
                  };
                  sessionStorage.setItem('sl_auto_location_result', JSON.stringify(detail));
                  window.dispatchEvent(new CustomEvent('location-selected', { detail: detail }));
                } catch(ex) {}

                callback(enrichedLocation);
              })
              .catch(function() {
                if (completed) return;
                completed = true;
                clearTimeout(timeout);
                callback(location);
              });
          }

          function buildWhatsAppTextWithAddress(text, addressText) {
            var address = String(addressText || '').trim();
            var current = String(text || '').trim();
            if (!address) return current;

            if (current.indexOf('{alamat lengkap}') !== -1) {
              return current.replace(/\\{alamat lengkap\\}/g, address);
            }

            if (/Alamat pengiriman:\\s*$/i.test(current)) {
              return current + '\\n' + address;
            }

            if (!current) {
              current = 'Halo Admin Santi Living by Santi Mebel Jogja,\\nSaya ingin menyewa kasur.';
            }

            return current + '\\n\\nAlamat pengiriman:\\n' + address;
          }

          function applyAddressToWhatsappText(url, addressText) {
            if (!addressText) return;
            var currentText = url.searchParams.get('text') || '';
            url.searchParams.set('text', buildWhatsAppTextWithAddress(currentText, addressText));
          }

          function applyLocationToSearchParams(url, location) {
            if (!location) return;
            if (location.location_permission) url.searchParams.set('location_permission', location.location_permission);
            if (typeof location.latitude === 'number') url.searchParams.set('latitude', String(location.latitude));
            if (typeof location.longitude === 'number') url.searchParams.set('longitude', String(location.longitude));
            if (typeof location.location_accuracy_m === 'number') {
              url.searchParams.set('location_accuracy_m', String(Math.round(location.location_accuracy_m)));
            }
            if (location.city) url.searchParams.set('city', location.city);
          }

          function navigateToWhatsapp(url) {
            window.location.href = url.toString();
          }

          function inferKarpetIntent(path, ctaSource, text) {
            var combined = [path, ctaSource, text].join(' ').toLowerCase();
            if (combined.indexOf('karpet merah') !== -1 || combined.indexOf('karpet-merah') !== -1 || combined.indexOf('red carpet') !== -1) {
              return 'sewa_karpet_merah';
            }
            if (combined.indexOf('permadani') !== -1 || combined.indexOf('pengajian') !== -1 || combined.indexOf('tahlilan') !== -1) {
              return 'sewa_karpet_permadani';
            }
            if (combined.indexOf('pameran') !== -1 || combined.indexOf('seminar') !== -1 || combined.indexOf('booth') !== -1) {
              return 'sewa_karpet_pameran';
            }
            if (combined.indexOf('paket') !== -1 || combined.indexOf('perlengkapan acara') !== -1) {
              return 'paket_perlengkapan_acara';
            }
            if (combined.indexOf('karpet') !== -1) {
              return 'sewa_karpet_jogja';
            }
            return '';
          }

          function inferWaTracking(link, url, ctaSource, ctaLocation) {
            var path = window.location.pathname || '';
            var text = '';
            try {
              text = url.searchParams.get('text') || '';
            } catch(ex) {}

            var combined = [path, ctaSource, text].join(' ').toLowerCase();
            var productCategory = link.getAttribute('data-product-category') || '';
            if (!productCategory && combined.indexOf('karpet') !== -1) {
              productCategory = 'karpet';
            }

            var pageType = link.getAttribute('data-page-type') || '';
            if (!pageType) {
              if (path.indexOf('/artikel/') === 0) {
                pageType = 'article';
              } else if (path === '/sewa-karpet-jogja') {
                pageType = 'money_page';
              } else if (path.indexOf('/sewa-karpet') === 0) {
                pageType = 'subcategory_page';
              }
            }

            var intent = link.getAttribute('data-wa-intent') || inferKarpetIntent(path, ctaSource, text);

            return {
              product_category: productCategory,
              page_type: pageType,
              intent: intent,
              location: ctaLocation || ''
            };
          }

          document.addEventListener('click', function(e) {
            var target = e.target;
            if (target && target.nodeType === 3) target = target.parentElement;
            if (!target || typeof target.closest !== 'function') return;

            var link = target.closest('a[href*="wa.me"], a[href*="whatsapp"], a[href^="/api/wa"], a[href*="/api/wa"]');
            if (link) {
              e.preventDefault();

              var ctaSource = link.getAttribute('data-wa-source') || 'unknown';
              var ctaLocation = link.getAttribute('data-wa-location') || '';
              var url;
              try {
                url = new URL(link.href, window.location.origin);
                if (ctaSource === 'unknown') {
                  ctaSource = url.searchParams.get('cta_source') || ctaSource;
                }
              } catch(ex) {
                window.location.href = link.href;
                return;
              }
              var leadEventId = createLeadEventId();

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
                    wbraid: t.wbraid || '',
                    fbclid: t.fbclid || ''
                  };
                }
              } catch(ex) {}

              var attrCode = getWaAttributionCode(attr);
              var waTracking = inferWaTracking(link, url, ctaSource, ctaLocation);

              // Build event params with full attribution
              var eventParams = {
                'event_category': 'engagement',
                'event_label': ctaSource,
                'cta_source': ctaSource,
                'cta_location': ctaLocation,
                'product_category': waTracking.product_category,
                'page_type': waTracking.page_type,
                'intent': waTracking.intent,
                'location': waTracking.location,
                'attribution_code': attrCode || '',
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
                'fbclid': attr.fbclid || '',
                'has_gclid': attr.gclid ? 'true' : 'false',
                'has_gbraid': attr.gbraid ? 'true' : 'false',
                'has_wbraid': attr.wbraid ? 'true' : 'false',
                'event_id': leadEventId,
                'transport_type': 'beacon'
              };

              // --- Client-side attribution enrichment ---
              try {
                if (url.pathname === '/api/wa') {
                  url.searchParams.set('event_id', leadEventId);
                  url.searchParams.set('cta_source', ctaSource);
                  if (ctaLocation) url.searchParams.set('cta_location', ctaLocation);
                  if (waTracking.product_category) url.searchParams.set('product_category', waTracking.product_category);
                  if (waTracking.page_type) url.searchParams.set('page_type', waTracking.page_type);
                  if (waTracking.intent) url.searchParams.set('intent', waTracking.intent);
                  url.searchParams.set('landing_page', window.location.pathname + window.location.search);
                  if (attr.utm_source) url.searchParams.set('source', attr.utm_source);
                  if (attr.utm_medium) url.searchParams.set('medium', attr.utm_medium);
                  if (attr.utm_campaign) url.searchParams.set('campaign', attr.utm_campaign);
                  if (attr.gclid) url.searchParams.set('gclid', attr.gclid);
                  if (attr.gbraid) url.searchParams.set('gbraid', attr.gbraid);
                  if (attr.wbraid) url.searchParams.set('wbraid', attr.wbraid);
                  if (attr.fbclid) url.searchParams.set('fbclid', attr.fbclid);
                }

                link.href = url.toString();
              } catch(ex) {}

              function finishWhatsAppClick(location) {
                reverseGeocodeLocation(location, function(enrichedLocation) {
                var leadPayload = {
                  event_id: leadEventId,
                  event_type: 'whatsapp_click',
                  source: attr.utm_source || '',
                  medium: attr.utm_medium || '',
                  campaign: attr.utm_campaign || '',
                  cta_source: ctaSource,
                  cta_location: ctaLocation,
                  product_category: waTracking.product_category,
                  page_type: waTracking.page_type,
                  intent: waTracking.intent,
                  landing_page: window.location.pathname + window.location.search,
                  device: '',
                  gclid: attr.gclid || '',
                  gbraid: attr.gbraid || '',
                  wbraid: attr.wbraid || '',
                  fbclid: attr.fbclid || '',
                  location_permission: enrichedLocation.location_permission || 'error',
                  latitude: enrichedLocation.latitude,
                  longitude: enrichedLocation.longitude,
                  location_accuracy_m: enrichedLocation.location_accuracy_m,
                  city: enrichedLocation.city || '',
                  user_agent: navigator.userAgent || '',
                  referrer: document.referrer || '',
                  timestamp: new Date().toISOString()
                };

                eventParams.location_permission = leadPayload.location_permission;

                trackGtagEvent('event', 'whatsapp_click', eventParams);

                sendLeadEvent(leadPayload);

                if (url.pathname === '/api/wa') {
                  applyLocationToSearchParams(url, enrichedLocation);
                }
                applyAddressToWhatsappText(url, enrichedLocation.address_text);

                // Google Ads conversion
                trackGtagEvent('event', 'conversion', {
                  'send_to': '${ADS_ID}/y7bwCKTm3J0cEOPb7MZC'
                });

                navigateToWhatsapp(url);
              });
              }

              var cachedAutoLocation = readCachedAutoLocation();
              if (cachedAutoLocation) {
                finishWhatsAppClick(cachedAutoLocation);
              } else {
                requestLeadLocation(finishWhatsAppClick);
              }

              return;
            }
            var telLink = target.closest('a[href^="tel:"]');
            if (telLink) {
              var phoneEventId = createLeadEventId();
              var phoneAttr = {};
              try {
                var phoneRaw = localStorage.getItem('sl_attribution_v1');
                if (phoneRaw) {
                  var phoneParsed = JSON.parse(phoneRaw);
                  var phoneTouch = phoneParsed.last || {};
                  phoneAttr = {
                    utm_source: phoneTouch.source || '',
                    utm_medium: phoneTouch.medium || '',
                    utm_campaign: phoneTouch.campaign || '',
                    gclid: phoneTouch.gclid || '',
                    gbraid: phoneTouch.gbraid || '',
                    wbraid: phoneTouch.wbraid || '',
                    fbclid: phoneTouch.fbclid || ''
                  };
                }
              } catch(ex) {}

              trackGtagEvent('event', 'phone_click', {
                'event_category': 'engagement',
                'event_id': phoneEventId,
                'transport_type': 'beacon'
              });

              sendLeadEvent({
                event_id: phoneEventId,
                event_type: 'phone_click',
                source: phoneAttr.utm_source || '',
                medium: phoneAttr.utm_medium || '',
                campaign: phoneAttr.utm_campaign || '',
                cta_source: telLink.getAttribute('data-phone-source') || 'phone_link',
                cta_location: telLink.getAttribute('data-phone-location') || '',
                landing_page: window.location.pathname + window.location.search,
                device: '',
                gclid: phoneAttr.gclid || '',
                gbraid: phoneAttr.gbraid || '',
                wbraid: phoneAttr.wbraid || '',
                fbclid: phoneAttr.fbclid || '',
                user_agent: navigator.userAgent || '',
                referrer: document.referrer || '',
                timestamp: new Date().toISOString()
              });
            }
          });
        `}
      </Script>
    </>
  );
}
