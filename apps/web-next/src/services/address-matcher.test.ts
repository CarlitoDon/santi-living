import { describe, expect, it } from 'vitest';
import { matchAddressToKode } from './address-matcher';

describe('matchAddressToKode', () => {
  it('matches Hotel Tentrem to the Kota Yogyakarta hierarchy', async () => {
    const result = await matchAddressToKode({
      kota: 'Kota Yogyakarta',
      kecamatan: 'Jetis',
      kelurahan: 'Cokrodiningratan',
      provinsi: 'Daerah Istimewa Yogyakarta',
      postcode: '55241',
    });

    expect(result).toMatchObject({
      kotaKode: '34.71',
      kota: 'Kota Yogyakarta',
      kecamatanKode: '34.71.02',
      kecamatan: 'Jetis',
      kelurahanKode: '34.71.02.1002',
      kelurahan: 'Cokrodiningratan',
      zip: '55241',
    });
  });
});
