# Implementation Plan: Automated WhatsApp Notification

**Branch**: `002-auto-wa-sender` | **Date**: 2026-01-06 | **Spec**: [Link](../spec.md)
**Input**: Feature specification from `/specs/002-auto-wa-sender/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement an automated backend service to send WhatsApp messages confirming orders immediately after submission. This replaces the manual "Click to WhatsApp" flow. The system requires an admin dashboard or CLI to authenticate via QR code using `whatsapp-web.js` or similar, and an API endpoint to receive order data from the Astro frontend.

## Technical Context

**Language/Version**: TypeScript / Node.js (Version TBD - NEEDS CLARIFICATION)
**Primary Dependencies**: `whatsapp-web.js` (or `baileys`), `express` (or Astro API routes?), `qrcode-terminal` (or UI-based QR?)
**Storage**: Local file storage for session auth / SQLite? (NEEDS CLARIFICATION: Where to persist session?)
**Testing**: Jest / Vitest for logic, manual testing for WhatsApp integration
**Target Platform**: Deployment environment TBD (NEEDS CLARIFICATION: Currently static site on Vercel/Netlify? Need a running server for WhatsApp bot)
**Project Type**: Web Application (Backend service addition)
**Performance Goals**: Message sent < 5s after trigger
**Constraints**: Must run persistently (cannot be serverless function due to WhatsApp session requirements)
**Scale/Scope**: Low volume (< 100 orders/day)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **North Star**: Directly supports "Seamless experience" and "Operational foundation"
- [x] **Mobile-First**: N/A (Backend feature, but improves mobile flow)
- [x] **One Intent**: Reduces steps for user (No manual send)
- [x] **Zero Cognitive Load**: Removes "Edit Message" friction
- [x] **WhatsApp as Final Gate**: **WARNING/CLARIFICATION NEEDED**: Constitution says "Form HARUS auto-compose pesan WhatsApp...". This feature _changes_ that to "System sends message". Does this violate "Conversation flow harus berakhir di WhatsApp"?
  - _Justification_: The _result_ is still a WhatsApp conversation. The _method_ changes from User-initiated to System-initiated. This actually _reduces_ friction (Principle III), aligning better with the North Star.
- [x] **MVP Scope**: "WhatsApp Auto-Compose" is listed as MVP. This is an enhancement.
  - _Constitution Governance_: "Changes MAJOR (scope/prinsip) require evaluation". This moves from "Client-side compose" to "Server-side send".

## Project Structure

### Documentation (this feature)

```text
specs/002-auto-wa-sender/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── pages/
│   └── api/
│       └── order.ts       # New API endpoint (if using Astro SSR)
├── scripts/
│   └── whatsapp-bot.ts    # Logic for WA connection (Maybe standalone service?)
├── backend/               # [POTENTIAL NEW DIR] If separating server
│   ├── src/
│   │   ├── bot/
│   │   │   ├── client.ts
│   │   │   └── session.ts
│   │   └── server.ts
```

**Structure Decision**: Needs resolution on Deployment/Runtime architecture (Static vs SSR vs Separate Backend) during Phase 0.

## Complexity Tracking

| Violation       | Why Needed                                  | Simpler Alternative Rejected Because                                   |
| --------------- | ------------------------------------------- | ---------------------------------------------------------------------- |
| Backend Service | WhatsApp Web.js requires persistent process | Serverless/Static cannot hold WebSocket connection open for WA session |
