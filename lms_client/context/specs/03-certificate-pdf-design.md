# Unit 03: Certificate PDF Design

## Goal

Replace the current broken, plain-text certificate PDF with a fully code-drawn (vector), branded certificate — fixing the root cause of why it currently looks unstyled, without depending on any new image asset.

## Scope

| File                                                                   | Role                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/Dashboard/user/Certificates/CertificateDownloadButton.tsx` | Owns all PDF generation (`jsPDF`). This is where the redesign happens.                                                                                                                                                                                                                                                                                               |
| `components/Dashboard/user/Certificates/CertificateTableColumn.tsx`    | Renders `<CertificateDownloadButton userName={...} courseName={...} />` per table row. Needs a small prop update if the new design uses `course.category` / `updatedAt` / ids (see Design below) — it already has all of this data in `row.original` (`TCertificateData`), so no data-fetching change is needed, only passing more of what's already there as props. |

## Current State (root cause)

`CertificateDownloadButton.tsx` currently does:

```ts
const doc = new jsPDF();
doc.addImage("/certificate.jpg", "JPEG", 0, 0, 210, 297);
doc.setFont("helvetica", "bold");
doc.setFontSize(38);
doc.text(userName, 15, 120);
doc.setFont("helvetica", "normal");
doc.setFontSize(24);
doc.text(`Has completed the course:`, 105, 160, { align: "center" });
doc.setFont("helvetica", "bold");
doc.setFontSize(28);
doc.text(courseName, 105, 176, { align: "center" });
doc.save(`${userName}_certificate.pdf`);
```

**`lms_client/public/certificate.jpg` does not exist** — confirmed by listing `lms_client/public/` (only `banner.png`, `banner2.png`, `favicon.ico`, and the default Next.js SVGs are present). `doc.addImage(...)` fails silently on a missing/invalid image, so the background never renders — the PDF that downloads today is just three lines of text on a blank white A4 page, with the name left-aligned at a somewhat arbitrary position. This matches the "just plain text" complaint exactly.

`jspdf` (`^4.2.1`) is not used anywhere else in the frontend — this is the only file that touches PDF generation. `pdf-lib` is listed in `package.json` but is unused in the frontend — not part of this fix.

## Design

Fix the root cause by drawing the entire certificate with jsPDF's vector API instead of an image — no new asset required. Recommended layout:

### Page

- Switch from the current implicit **portrait** A4 (`210×297`) to **landscape** A4 (`297×210`) — conventional for certificates and gives room for a proper layout. Instantiate as `new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })`.

### Structure (top to bottom)

1. **Border:** an outer decorative frame — e.g. a thick brand-color rule ~8mm from the page edge (`setDrawColor` + `setLineWidth(2)` + `rect(x, y, w, h)`), plus a thinner inner rule a few mm inside it, using `prime-100` (`#4f46e5`) for the outer line and `prime-50` (`#6366f1`) or `black-100` (`#020817`) for the inner accent.
2. **Header / wordmark:** "MATS ACADEMY" (the site's actual brand name, from `context/project-overview.md`) centered near the top in bold, brand-colored text — a text wordmark, not a raster logo, since no logo image asset exists in `public/` today. A short tagline or thin divider line beneath it is optional polish.
3. **Title:** "Certificate of Completion" — large, bold, centered, in `black-100` or the brand accent color.
4. **Recipient name:** the largest, most prominent text on the page, centered (not left-aligned at a fixed `x=15` like today) — e.g. `doc.text(userName, pageWidth / 2, y, { align: "center" })`. Consider an underline rule beneath the name for a classic certificate look.
5. **Body copy:** "has successfully completed the course" (centered, normal weight, smaller than the name), followed by the **course name** in bold, larger emphasis — optionally with the course category as a smaller subtitle/badge-style line beneath it (`course.category`, if passed down — see Implementation Notes).
6. **Footer row** (bottom of the page, split left/right or three-across):
   - **Completion date:** formatted from `updatedAt` (already available on `TCertificateData` in `CertificateTableColumn.tsx`, currently not passed to the button at all) — e.g. "Completed on 12 Jul 2026" instead of no date shown today.
   - **Certificate ID:** a short, deterministic verification code derived client-side from `user._id` + `course._id` (e.g. the first 6–8 characters of `${user._id}${course._id}` uppercased, or a simple hash) — no backend change needed, purely cosmetic/traceable, documented here as a client-side-only formula (not a real verifiable registry).
   - **Signature line:** a short horizontal rule with "MATS Academy" (or "Authorized Signature") caption beneath it, since there's no real instructor-signature data available to render.

### Color mapping (from `context/ui-context.md`)

| Use                             | Token                                                                                                              | Hex       | jsPDF                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------- | ----------------------------------------------------------------- |
| Outer border, headline accents  | `prime-100`                                                                                                        | `#4f46e5` | `doc.setDrawColor(79, 70, 229)` / `doc.setTextColor(79, 70, 229)` |
| Inner border, secondary accents | `prime-50`                                                                                                         | `#6366f1` | `doc.setDrawColor(99, 102, 241)`                                  |
| Primary body/title text         | `black-100`                                                                                                        | `#020817` | `doc.setTextColor(2, 8, 23)`                                      |
| Muted footer text               | mid-gray (no project token for PDF-safe gray; use a plain `#6b7280`-equivalent, `doc.setTextColor(107, 114, 128)`) | —         | —                                                                 |

(jsPDF's color setters take RGB integers 0–255, computed by converting each hex pair — the table above already gives the converted values.)

## Implementation Notes

- **No new dependencies.** `jsPDF`'s existing drawing primitives (`rect`, `line`, `setDrawColor`, `setFillColor`, `setLineWidth`, `setFont`, `setFontSize`, `setTextColor`, `text` with `align`) cover the entire design above — no `addImage` call, no new file in `public/`.
- **Props:** extend `CertificateDownloadButton`'s `Props` type to accept the additional fields the design uses — e.g. `category?: string`, `completedOn: string` (raw `updatedAt`), `userId: string`, `courseId: string` — and update `CertificateTableColumn.tsx`'s `cell` for the `"Certificate"` column to pass `row.original.course.category`, `row.original.updatedAt`, `row.original.user._id`, and `row.original.course._id` alongside the existing `userName`/`courseName`. All of this data is already present in `TCertificateData` — this is a prop-plumbing change only, not a data-fetching change.
- **Date formatting:** reuse `date-fns`'s `format` (already used the same way in `CertificateTableColumn.tsx` for the table's "Finished On" column) for consistency, e.g. `format(new Date(completedOn), "dd MMM yyyy")`.
- **Filename:** keep `doc.save(`${userName}\_certificate.pdf`)` (or lightly sanitize spaces if desired) — unchanged behavior, not part of the visual redesign.
- **Long text handling:** long course names or user names should not overflow the page — use `doc.splitTextToSize(text, maxWidth)` for the course-name line if it risks exceeding the printable width at the largest font size, or reduce font size responsively based on `doc.getTextWidth(...)`.

## Verify When Done

- [ ] Clicking "Download" produces a PDF with the full designed layout (border, wordmark, title, centered name, course name/category, date, certificate ID, signature line) — no blank/missing-image artifacts.
- [ ] Colors match the project's actual brand tokens (`prime-100`/`prime-50`/`black-100`), not arbitrary colors.
- [ ] Page orientation is landscape and content is fully within the printable area (nothing clipped near the border).
- [ ] Long course names and user names don't overflow or collide with other elements.
- [ ] The completion date shown matches the "Finished On" column already shown in the certificates table.
- [ ] Filename download behavior (`${userName}_certificate.pdf`) still works.
- [ ] `yarn lint` and `yarn build` pass cleanly (no unused-import lint errors from removing the old `addImage` call).
