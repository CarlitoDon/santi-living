# Data Model: Automated WhatsApp Notification

**Feature**: `002-auto-wa-sender`

## Entities

### OrderPayload

_Data structure sent from Frontend to Bot Service_

| Field              | Type             | Description               | Validation                           |
| ------------------ | ---------------- | ------------------------- | ------------------------------------ |
| `customerName`     | String           | Name of the customer      | Required, Min 2 chars                |
| `customerWhatsapp` | String           | Customer's phone number   | Required, Format: `08...` or `62...` |
| `deliveryAddress`  | String           | Full address string       | Required                             |
| `items`            | Array<OrderItem> | List of ordered items     | Min 1 item                           |
| `totalPrice`       | Number           | Final calculated price    | > 0                                  |
| `orderDate`        | String (ISO)     | Start date of rental      | Valid future date                    |
| `duration`         | Number           | Duration in days          | Config min/max                       |
| `deliveryFee`      | Number           | Calculated delivery cost  | >= 0                                 |
| `isPackage`        | Boolean          | Package vs Unit selection | Required                             |

### OrderItem

_Sub-entity for OrderPayload_

| Field         | Type   | Description  |
| ------------- | ------ | ------------ |
| `name`        | String | Product name |
| `quantity`    | Number | Count        |
| `pricePerDay` | Number | Unit price   |

## States

### BotSessionState

_Internal state of the WhatsApp Client_

- **UNINITIALIZED**: Bot process started, client not created.
- **QR_PENDING**: Client created, waiting for QR scan.
- **AUTHENTICATING**: QR scanned, exchanging keys.
- **READY**: Session established, ready to send.
- **DISCONNECTED**: Connection lost, might need re-auth or auto-reconnect.

### MessageStatus

_Result of send attempt_

- **QUEUED**: Accepted by API.
- **SENT**: Acknowledged by WhatsApp network.
- **FAILED**: Rejected (invalid number, network error).
