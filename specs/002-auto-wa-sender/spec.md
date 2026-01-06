# Feature Specification: Automated WhatsApp Notification

**Feature Branch**: `002-auto-wa-sender`
**Created**: 2026-01-06
**Status**: Draft
**Input**: User description: "setiap pesanan yang dikirim client, maka nomor WA akan dikirimi oleh admin pesanan . jadi ubah existing flow dimana setelah submit customer harus ngirim wa, kita yang ngirim wa ke customer. pakai WA qr login"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Customer Order Submission (Priority: P1)

The customer fills out the order form and submits it. Instead of being redirected to WhatsApp to send a manual message, the system automatically sends the confirmation message to their WhatsApp number.

**Why this priority**: Improves user experience by removing the friction of manual message sending and ensuring the admin controls the initial communication format.

**Independent Test**: Can be tested by submitting a form with a valid phone number and verifying a message is received on that number.

**Acceptance Scenarios**:

1. **Given** a valid order form, **When** user clicks "Pesan Sekarang", **Then** the UI shows a success loading state.
2. **Given** the internal system receives the order, **Then** it automatically sends a formatted WhatsApp message to the customer's number.
3. **Given** the message is sent successfully, **Then** the UI updates to show a "Pesanan Berhasil" confirmation.

---

### User Story 2 - Admin WhatsApp Session Management (Priority: P1)

The admin needs to authenticate the system to send messages on their behalf using WhatsApp Web's QR code mechanism.

**Why this priority**: Critical for FR-003; without a valid session, the system cannot send messages.

**Independent Test**: Verify that the system generates a QR code and, upon scanning with a real WhatsApp account, establishes a "Ready" state.

**Acceptance Scenarios**:

1. **Given** the system is started and not authenticated, **When** admin views the specialized admin/logs area, **Then** a QR code is displayed (either in terminal or admin UI).
2. **Given** a displayed QR code, **When** admin scans it with WhatsApp, **Then** the system confirms "Authenticated".

---

### Edge Cases

- **Session Disconnected**: What happens if the admin's phone disconnects? System should queue messages or log error to admin.
- **Invalid Number**: What happens if the customer enters a non-WhatsApp number? System should log failure; potentially notify admin via fallback.
- **Concurrent Orders**: What happens if multiple orders arrive? System should process them sequentially to avoid rate limits.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide an API endpoint to receive order details from the frontend Calculator.
- **FR-002**: System MUST validate the phone number format before attempting to send.
- **FR-003**: System MUST utilize a WhatsApp automation interface to maintain an authenticated session via QR code login.
- **FR-004**: System MUST format the order message identical to the current manual template (Items, Date, Total, Address, Delivery Fee).
- **FR-005**: System MUST send the message to the customer's provided WhatsApp number immediately upon receipt.
- **FR-006**: System MUST handle "not registered on WhatsApp" errors gracefully (e.g., feedback to admin logs).
- **FR-007**: Frontend MUST show a success message to the user after the backend accepts the request (async processing).

### Key Entities

- **OrderPayload**: Contains items, dates, customer info, quantities, and calculated totals.
- **WhatsAppClient**: Represents the automated bot instance linked to the Admin's number.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Customer receives the WhatsApp confirmation message within 30 seconds of clicking "Pesan Sekarang" (assuming valid network).
- **SC-002**: System maintains WhatsApp session across restarts (saving session data locally).
- **SC-003**: 100% of successfully validated orders trigger a message attempt.

## Assumptions & Dependencies

- **Assumption**: A Node.js runtime is available to host the WhatsApp client (cannot run purely in client-side browser/static hosting).
- **Assumption**: The "Admin" phone number is a standard WhatsApp account (Business or Personal) and can scan the QR code.
- **Dependency**: `whatsapp-web.js` or `baileys` library.
