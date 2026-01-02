# Contracts: Santi Living

**Feature**: 001-seo-living-marketing  
**Date**: 2026-01-02

## Overview

Untuk MVP Phase 1, **tidak ada API contracts** yang diperlukan karena:

1. **Static Site**: Website adalah static site yang di-generate pada build time
2. **No Backend**: Tidak ada custom backend - form submission ke Google Sheets
3. **Data Source**: Semua data (products, areas, testimonials) adalah static JSON files

## External Integrations

### 1. Google Sheets (Form Submission)

**Type**: POST request to Google Apps Script Web App

**Endpoint** (to be configured):

```
https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec
```

**Request Format**:

```typescript
// POST body (form-urlencoded or JSON)
{
  "timestamp": "2026-01-02T17:30:00+07:00",
  "name": "John Doe",
  "whatsapp": "081234567890",
  "address": "Jl. Kaliurang KM 5, Sleman",
  "mattressType": "double",
  "quantity": 2,
  "startDate": "2026-01-15",
  "duration": 3,
  "endDate": "2026-01-18",
  "total": 240000,
  "notes": "Tolong antar sebelum jam 10"
}
```

**Response**:

```json
{
  "result": "success",
  "row": 42
}
```

**Error Response**:

```json
{
  "result": "error",
  "message": "Missing required field: name"
}
```

### 2. WhatsApp (wa.me URL)

**Type**: URL redirect (no API call)

**Format**:

```
https://wa.me/{PHONE_NUMBER}?text={ENCODED_MESSAGE}
```

**Example**:

```
https://wa.me/6281234567890?text=Halo%2C%20saya%20mau%20sewa%3A%0A-%20Kasur%3A%20Double%0A-%20Jumlah%3A%202%0A...
```

## Future Contracts (Phase 2+)

Jika volume order meningkat (> 5/hari stabil), API contracts berikut mungkin diperlukan:

### Orders API (Phase 2)

```yaml
# OpenAPI 3.0 Skeleton
paths:
  /api/orders:
    post:
      summary: Create new order
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/OrderRequest"
      responses:
        "201":
          description: Order created

  /api/orders/{id}:
    get:
      summary: Get order by ID
    patch:
      summary: Update order status

components:
  schemas:
    OrderRequest:
      type: object
      required:
        [name, whatsapp, address, mattressType, quantity, startDate, duration]
      properties:
        name: { type: string }
        whatsapp: { type: string }
        # ... (same as BookingRequest in data-model.md)
```

### Availability API (Phase 3)

```yaml
paths:
  /api/availability:
    get:
      summary: Check mattress availability for date range
      parameters:
        - name: mattressType
          in: query
          required: true
        - name: startDate
          in: query
          required: true
        - name: endDate
          in: query
          required: true
      responses:
        "200":
          description: Availability status
          content:
            application/json:
              schema:
                type: object
                properties:
                  available: { type: boolean }
                  maxQuantity: { type: integer }
```

## Notes

- Phase 1 MVP tidak memerlukan API contracts karena semua operasi client-side atau via external services
- Google Sheets Apps Script akan di-setup manual oleh tim
- WhatsApp integration menggunakan standard wa.me URL scheme
