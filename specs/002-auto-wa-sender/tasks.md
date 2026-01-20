# Task List: Automated WhatsApp Notification

**Feature**: `002-auto-wa-sender`
**Phase**: Implementation
**Status**: Finished

## Dependencies

- US2 (Admin Session) REQUIRED FOR US1 (Order Submission) to actually send messages.
- Both stories can be developed in parallel, but integration testing requires both.

## Phase 1: Setup

**Goal**: Initialize the separate Bot Service structure and dependencies.

- [x] T001 Initialize `apps/bot-service` directory with `package.json` and TypeScript config
- [x] T002 Install dependencies (`whatsapp-web.js`, `express`, `qrcode-terminal`, `cors`, `dotenv`) in `apps/bot-service`
- [x] T003 Configure `tsconfig.json` for Node.js environment in `apps/bot-service/tsconfig.json`
- [x] T004 Create basic Express server structure with health check endpoint in `apps/bot-service/src/server.ts`

## Phase 2: Foundational (Bot Service Core)

**Goal**: Establish the WhatsApp client logic capable of authentication and message sending.

- [x] T005 [P] Create `BotSession` class to manage `whatsapp-web.js` client instance in `apps/bot-service/src/bot/session.ts`
- [x] T006 Implement QR code generation event handler in `apps/bot-service/src/bot/handlers.ts` to output to console/logs
- [x] T007 Implement session storage logic (LocalAuth) in `apps/bot-service/src/bot/config.ts`
- [x] T008 [P] Integrate `BotSession` with Express server startup in `apps/bot-service/src/server.ts`

## Phase 3: User Story 2 - Admin WhatsApp Session Management

**Goal**: Admin can authenticate the bot via QR code.

**Independent Test**:

- Start service -> See QR code in terminal -> Scan -> See "Ready" log.

- [x] T009 [US2] Implement `/status` endpoint to return bot state (INITIALIZING, QR_PENDING, READY) in `apps/bot-service/src/api/status.ts`
- [x] T010 [US2] update `BotSession` to expose current QR string for API consumption (optional, for UI integration later) in `apps/bot-service/src/bot/session.ts`
- [x] T011 [US2] Add basic CLI output for QR code using `qrcode-terminal` in `apps/bot-service/src/index.ts` (entry point)

## Phase 4: User Story 1 - Customer Order Submission

**Goal**: Frontend sends order to Bot Service, Bot sends WhatsApp message.

**Independent Test**:

- Use Postman to POST /send-order -> Receive WhatsApp message on target phone.

- [x] T012 [P] [US1] Define `OrderPayload` interface and validation schema in `apps/bot-service/src/types/order.ts`
- [x] T013 [US1] Implement `/send-order` endpoint controller in `apps/bot-service/src/api/send-order.ts`
- [x] T014 [US1] Implement message formatting logic (template matching manual manual string) in `apps/bot-service/src/utils/formatter.ts`
- [x] T015 [US1] Add phone number validation and formatting (08->62) util in `apps/bot-service/src/utils/phone.ts`
- [x] T016 [US1] Wire up endpoint to `BotSession.sendMessage` in `apps/bot-service/src/api/send-order.ts`
- [x] T017 [US1] Add API Key middleware protection for `/send-order` in `apps/bot-service/src/middleware/auth.ts`

## Phase 5: Integration (Frontend)

**Goal**: Connect Calculator.astro to the new Bot Service.

- [x] T018 [US1] Update `src/data/config.json` (or `.env`) with `BOT_API_URL` and `BOT_API_KEY` in frontend project
- [x] T019 [US1] Create `src/services/api.ts` in frontend to handle `fetch` to Bot Service
- [x] T020 [US1] Modify `src/scripts/calculator.ts` `handleWhatsAppClick` to call API instead of `window.open`
- [x] T021 [US1] Update UI to show "Sending..." state and Success/Error feedback in `src/components/Calculator.astro` and `src/scripts/calculator.ts`

## Phase 6: Polish

- [x] T022 Add error handling for "Bot Not Ready" scenarios in frontend
- [x] T023 Add logging for sent messages in `apps/bot-service` (file or console)
- [x] T024 Document run instructions in repo `README.md`

## Parallel Execution Opportunities

- Phase 2 (Bot Core) and Phase 5 (Frontend Integration) can be started roughly in parallel, mocking the API on the frontend side first.
- T005, T008, T012 are independent.

## Implementation Strategy

1. **Bot Service First**: We need the backend running to receive requests.
2. **Contract Testing**: Verify `/send-order` works with Postman/Curl before touching Frontend.
3. **Frontend Integration**: Hook up the UI last.
