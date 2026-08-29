/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadGoogleMaps, resetGoogleMapsLoaderForTests } from './google-maps-loader';

describe('loadGoogleMaps', () => {
  afterEach(() => {
    resetGoogleMapsLoaderForTests();
    vi.useRealTimers();
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY;
    Reflect.deleteProperty(window, 'google');
  });

  it('fails closed when the browser-restricted key is absent', async () => {
    await expect(loadGoogleMaps()).rejects.toMatchObject({ code: 'NOT_CONFIGURED' });
  });

  it('loads the official Google Maps JavaScript endpoint asynchronously', async () => {
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY = 'browser-key';
    const importLibrary = vi.fn().mockResolvedValue({});
    const promise = loadGoogleMaps();
    const script = document.getElementById('santi-google-maps-js') as HTMLScriptElement;

    expect(script.src).toContain('https://maps.googleapis.com/maps/api/js?');
    expect(script.src).toContain('loading=async');
    expect(script.src).toContain('auth_referrer_policy=origin');

    (window as typeof window & { google: typeof google }).google = {
      maps: {
        importLibrary,
        Map: class {},
        Marker: class {},
      } as unknown as typeof google.maps,
    } as typeof google;
    script.dispatchEvent(new Event('load'));

    await expect(promise).resolves.toBe(window.google.maps);
    expect(importLibrary).toHaveBeenCalledWith('maps');
    expect(importLibrary).toHaveBeenCalledWith('marker');
  });

  it('times out, cleans up, and permits a retry when the script never settles', async () => {
    vi.useFakeTimers();
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY = 'browser-key';

    const firstScript = document.getElementById('santi-google-maps-js');
    expect(firstScript).toBeNull();
    const firstLoad = expect(loadGoogleMaps()).rejects.toMatchObject({ code: 'LOAD_FAILED' });
    const pendingScript = document.getElementById('santi-google-maps-js');
    expect(pendingScript).not.toBeNull();

    await vi.advanceTimersByTimeAsync(10_000);
    await firstLoad;
    expect(document.getElementById('santi-google-maps-js')).toBeNull();

    const retry = loadGoogleMaps();
    const retryScript = document.getElementById('santi-google-maps-js') as HTMLScriptElement;
    expect(retryScript).not.toBe(pendingScript);
    const importLibrary = vi.fn().mockResolvedValue({});
    (window as typeof window & { google: typeof google }).google = {
      maps: {
        importLibrary,
        Map: class {},
        Marker: class {},
      } as unknown as typeof google.maps,
    } as typeof google;
    retryScript.dispatchEvent(new Event('load'));

    await expect(retry).resolves.toBe(window.google.maps);
  });
});
