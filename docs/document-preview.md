# Document Preview

Unified in-app document preview for Lexfield Control.

## Components

| File | Purpose |
|------|---------|
| `resources/js/components/document-preview-modal.tsx` | Modal with inline preview, loading/error states, Download, Open in new tab, Close |
| `resources/js/components/document-preview-trigger.tsx` | Button/link that opens the modal |
| `resources/js/lib/document-preview.ts` | MIME/extension helpers for PDF and image detection |

## Supported preview types

- **PDF** — rendered in an `<iframe>` via authenticated `view` routes
- **Images** (png, jpg, gif, webp, etc.) — rendered with `<img>`
- **DOC/DOCX and other types** — modal shows a fallback message; use Download or Open in new tab

## Security

All files are served from `storage/app/private` through authenticated Laravel routes (`auth`, `verified` middleware). Each endpoint uses `Gate::authorize` with the appropriate permission slug. The modal uses same-origin requests so session cookies apply; unauthorized users receive 403 and see an error state.

## Section behavior (after implementation)

| Section | View | Download | Notes |
|---------|------|----------|-------|
| Documents index/show | Preview modal | Optional link | `documents.view` / `documents.download` |
| Case docs / case docs page | Preview modal | Optional link | Same as documents |
| Messages — linked documents | Preview modal | In modal + permission | `documents.view` |
| Messages — uploaded files | Preview modal | In modal | `messages.download` |
| Reports — attachments | Preview modal | In modal | `documents.view` / `documents.download` |
| Invoices / quotes / letters / receipts | Preview modal | Separate page button | PDF `view` streams inline; `download` attaches file |
| Notification letters (HTML body) | In-page HTML | PDF via preview modal | Unchanged HTML display |
| Dashboard / case show | Metadata only | — | No file links (unchanged) |

## Backend view routes

- `GET documents/{document}/view`
- `GET conversation-attachments/{attachment}/view`
- `GET invoices/{invoice}/view`
- `GET invoices/{invoice}/receipt/view`
- `GET quotes/{quote}/view`
- `GET notification-letters/{notification_letter}/view`
- `GET payments/{payment}/receipt/view`
