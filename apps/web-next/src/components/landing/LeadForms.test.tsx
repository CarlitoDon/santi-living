/**
 * @vitest-environment jsdom
 */
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ChairLeadForm } from './ChairLeadForm';
import { MattressLeadForm } from './MattressLeadForm';

interface WindowWithGtag extends Window {
  gtag?: Mock;
}

describe('Isolated Landing Page Lead Forms (2 Fields Only)', () => {
  const customWindow = window as WindowWithGtag;

  beforeEach(() => {
    vi.restoreAllMocks();
    delete customWindow.gtag;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ eventId: 'evt-123', cityClassification: 'service_area' }),
    } as Response);
  });

  afterEach(() => {
    cleanup();
  });

  describe('ChairLeadForm', () => {
    it('renders only nama and whatsapp inputs plus WhatsApp CTA and microcopy', () => {
      render(<ChairLeadForm />);

      expect(screen.getByLabelText(/nama lengkap/i)).toBeTruthy();
      expect(screen.getByLabelText(/nomor whatsapp/i)).toBeTruthy();

      // Ensure dropped fields do not exist
      expect(screen.queryByLabelText(/pilihan kursi/i)).toBeNull();
      expect(screen.queryByLabelText(/jumlah kursi/i)).toBeNull();
      expect(screen.queryByLabelText(/alamat/i)).toBeNull();
      expect(screen.queryByLabelText(/tanggal/i)).toBeNull();
      expect(screen.queryByLabelText(/catatan/i)).toBeNull();

      expect(
        screen.getByRole('button', { name: /konsultasi & pesan via whatsapp/i }),
      ).toBeTruthy();
      expect(
        screen.getByText(/tanpa ribet\. admin langsung balas rincian ketersediaan & ongkir ke whatsapp anda\./i),
      ).toBeTruthy();
    });

    it('validates required name and minimum 9 digit phone number', async () => {
      render(<ChairLeadForm />);
      const submitBtn = screen.getByRole('button', { name: /konsultasi & pesan via whatsapp/i });

      fireEvent.click(submitBtn);
      expect(await screen.findByText(/mohon isi nama lengkap anda/i)).toBeTruthy();

      fireEvent.change(screen.getByLabelText(/nama lengkap/i), { target: { value: 'Budi' } });
      fireEvent.change(screen.getByLabelText(/nomor whatsapp/i), { target: { value: '08123' } });
      fireEvent.click(submitBtn);

      expect(await screen.findByText(/nomor whatsapp minimal 9 digit angka/i)).toBeTruthy();
    });

    it('submits lead tracking with simplified content and formats WhatsApp message', async () => {
      const gtagMock = vi.fn();
      customWindow.gtag = gtagMock;

      render(<ChairLeadForm />);

      fireEvent.change(screen.getByLabelText(/nama lengkap/i), { target: { value: 'Budi Santoso' } });
      fireEvent.change(screen.getByLabelText(/nomor whatsapp/i), { target: { value: '081234567890' } });

      const submitBtn = screen.getByRole('button', { name: /konsultasi & pesan via whatsapp/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledWith(
          '/api/lead/track',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('"content":"Nama: Budi Santoso | WA: 081234567890"'),
          }),
        );
      });

      await waitFor(() => {
        expect(gtagMock).toHaveBeenCalledWith('event', 'form_submit', expect.any(Object));
        expect(gtagMock).toHaveBeenCalledWith('event', 'santi_whatsapp_qualified', expect.any(Object));
        expect(gtagMock).toHaveBeenCalledWith('event', 'conversion', expect.any(Object));
      });
    });
  });

  describe('MattressLeadForm', () => {
    it('renders only nama and whatsapp inputs plus WhatsApp CTA and microcopy', () => {
      render(<MattressLeadForm />);

      expect(screen.getByLabelText(/nama lengkap/i)).toBeTruthy();
      expect(screen.getByLabelText(/nomor whatsapp/i)).toBeTruthy();

      // Ensure dropped fields do not exist
      expect(screen.queryByLabelText(/paket/i)).toBeNull();
      expect(screen.queryByLabelText(/durasi/i)).toBeNull();
      expect(screen.queryByLabelText(/alamat/i)).toBeNull();
      expect(screen.queryByLabelText(/tanggal/i)).toBeNull();
      expect(screen.queryByLabelText(/catatan/i)).toBeNull();

      expect(
        screen.getByRole('button', { name: /konsultasi & pesan via whatsapp/i }),
      ).toBeTruthy();
      expect(
        screen.getByText(/tanpa ribet\. admin langsung balas rincian ketersediaan & ongkir ke whatsapp anda\./i),
      ).toBeTruthy();
    });

    it('submits lead tracking with simplified content and triggers conversions', async () => {
      const gtagMock = vi.fn();
      customWindow.gtag = gtagMock;

      render(<MattressLeadForm />);

      fireEvent.change(screen.getByLabelText(/nama lengkap/i), { target: { value: 'Siti Rahma' } });
      fireEvent.change(screen.getByLabelText(/nomor whatsapp/i), { target: { value: '089876543210' } });

      const submitBtn = screen.getByRole('button', { name: /konsultasi & pesan via whatsapp/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledWith(
          '/api/lead/track',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('"content":"Nama: Siti Rahma | WA: 089876543210"'),
          }),
        );
      });

      await waitFor(() => {
        expect(gtagMock).toHaveBeenCalledWith('event', 'form_submit', expect.any(Object));
        expect(gtagMock).toHaveBeenCalledWith('event', 'santi_whatsapp_qualified', expect.any(Object));
        expect(gtagMock).toHaveBeenCalledWith('event', 'conversion', expect.any(Object));
      });
    });
  });
});
