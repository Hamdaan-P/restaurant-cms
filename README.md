# Restaurant CMS — Built From Scratch

A content management system built from scratch for a restaurant client, as part of the ZaryahPlus intern task "Build Our Own CMS." The restaurant owner edits every word, price, and photo on the site from a browser — no code, no developer.

**Live site:** https://restaurant-cms-omega.vercel.app
**Admin panel:** https://restaurant-cms-omega.vercel.app/admin

---

## Stack and Why

| Piece | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 (Turbopack)** | One project serves the public site, the admin panel, and the backend (Server Actions) — and it is the React-style stack the team uses. |
| Database | **Postgres on Neon** (via Prisma) | Real hosted persistence — a deployed site cannot reach a desktop database. Free tier. |
| Auth | **Auth.js** (Credentials + bcrypt, JWT sessions) | The brief forbids inventing your own password hashing — this is the established wheel. Sessions expire after 8 hours. |
| Media | **Cloudinary** (signed uploads) | Real object storage; the browser gets a server-signed permission slip, so API secrets never leave the server. |
| Hosting | **Vercel** | Free public URL, auto-deploys from GitHub, built by the Next.js team. |
| Styling | **Tailwind CSS** | A UI utility library (allowed by the brief); all content still comes from the database. |

No existing CMS was used. The content modelling (`src/lib/contentTypes.ts`), the schema-driven admin (`FormMaker.tsx`), and the draft→preview→publish flow are all built in this repo.

---

## Setup

The live site is already deployed and reachable at the URLs above — no local setup is needed to review it. The steps below are for running the project locally.

1. Clone the repo and install:
   ```
   git clone https://github.com/Hamdaan-P/restaurant-cms.git
   cd restaurant-cms
   npm install
   ```
2. Create a `.env` file with these seven keys. The real values are not committed — request them privately; they connect to the live demo database and Cloudinary account.
   ```
   DATABASE_URL=            # Neon Postgres URL, must end with ?sslmode=require
   AUTH_SECRET=             # long random string
   ADMIN_EMAIL=             # admin login email
   ADMIN_PASSWORD=          # admin login password
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```
3. Generate the Prisma client:
   ```
   npx prisma generate
   ```
4. Run it:
   ```
   npm run dev
   ```
   Public site at `http://localhost:3000`, admin at `http://localhost:3000/admin`.

> **Important — do not run the seed or migration scripts against the provided database.** The supplied `.env` points at the live demo database, which is already populated. Running `npm run` seed or `prisma migrate` could overwrite or duplicate real rows. Those commands are only for setting up a *fresh, empty* database of your own.

*If you prefer full isolation:* create your own free Neon database and Cloudinary account, put those values in `.env`, then run `npx prisma migrate deploy` (applies the tracked migrations in `prisma/migrations/`), `npm run create-admin` (creates your admin login), and optionally the seed to populate demo content.

---

## Content Model (the spine of the system)

Eight Prisma models. Seven are editable content types, defined once in a single registry (`src/lib/contentTypes.ts`); the eighth is the admin-user model for authentication. Every content type declares its fields, input kinds, required-field messages, and whether it is a reorderable list.

```
MenuItem:     name, description, price, image, order, status
GalleryImage: image, caption, order, status
StaffMember:  name, designation, photo, order
Contact:      address, phone, email, hours, status
Home:         headline, subtext, buttonText, featured dishes → (references MenuItems), status
About:        story, photo, staff list → (StaffMembers), status
SiteSettings: restaurantName, tagline, status
AdminUser:    email, hashed password        (authentication only, not editable content)
```

**Design rules baked in:**
- Every **list** type (MenuItem, GalleryImage, StaffMember) has an `order` field so the client can reorder items — position is data, not code.
- Every content type has a `status` field (**DRAFT / PUBLISHED**). Public pages query PUBLISHED rows only; the admin sees everything.
- Home's featured dishes are **references** to MenuItems, not copies — one card, one truth. A price change on the menu updates the home page automatically.
- **Zero hardcoded content**: every visible word and image on the public pages is fetched from Postgres at request time.

## How the admin stays schema-driven

There are **zero per-type admin page files**. The routes `/admin/[type]`, `/admin/[type]/new`, and `/admin/[type]/[id]` all read the registry, and one component — `FormMaker.tsx` — draws whichever form the schema describes (text field → text box, image field → validated Cloudinary uploader, and so on). One Server Action file (`app/admin/actions.ts`) handles save, delete, reorder, and upload-signing for all seven types, checking authentication before every write.

**Adding a field to a content type = one entry in the registry + one Prisma schema line.** No form is ever rewritten.

## Safety for a non-technical user

- Admin is fully login-gated (`proxy.ts` guards every `/admin` route except login); wrong passwords get one deliberately vague message; sessions expire after 8 hours.
- Every destructive action confirms first, by name, in a dialog — cancel changes nothing, and after a delete the remaining items renumber with no gaps.
- Validation speaks human: an empty required field says something like "Please add a name for this dish," never a raw error.
- Image uploads are validated for type both in the browser and — crucially — on the server: allowed_formats is signed into the Cloudinary upload, so a non-image can't be slipped past by bypassing the browser. Size is checked in the browser (5 MB) with a hard server-side ceiling at Cloudinary's plan limit.
- Drafts can be **previewed** exactly as visitors would see them (a sticky PREVIEW MODE banner makes the mode unmistakable) before a deliberate Publish.

---

## How would I reuse this CMS for a completely different client, and what exactly would I have to change?

Two things change: **the content models and the styling.** For a dental clinic, I would replace the restaurant types in `src/lib/contentTypes.ts` (and the matching Prisma models) with, say, `Treatment { name, description, duration, fee, image, order, status }` and restyle the public View components. Everything else — the login and session system, the schema-driven FormMaker, the reorder/delete/confirm machinery, signed Cloudinary uploads, and the draft→preview→publish flow — carries over untouched, because admin forms are generated from the registry rather than hand-built per page. That is the difference between building one website and building a CMS.

---

## The Non-Technical Test (Rule 4)

**Tested by:** Ahmed — a friend with no coding or CMS background.

**Tasks given** (with no guidance beyond the task list): change the restaurant's phone number; add a new dish with a photo and price; move that dish to the top of the menu.

**Result:** Completed all three tasks unaided. Editing text, uploading an image, and reordering the list were all immediately intuitive to him.

**What confused him:** After making his changes, he couldn't work out how to see them on the live site. The "View public site" link is small and tucked in the top-right of the admin header, and he didn't spot it until I pointed it out. He had successfully edited the content but had no obvious way to confirm his change had gone live — he wasn't sure whether it had "worked."

**Takeaway:** The admin has no confirmation loop. A first-time user edits something, then is left unsure whether it actually reached the public site. **Planned improvement:** surface a prominent "View live site →" link, ideally right after a successful save, so a non-technical user can immediately verify their change without hunting for it.

---

## Known Limitations (deliberate)

- The client cannot change their own password from the admin — credential management stays with the developer for now.
- The provided admin credential is a demo one, to be rotated before real client content.
- Placeholder images (placehold.co) are used where real photography does not exist yet; a one-off idempotent script (`npm run fix-placeholder-urls`) keeps them compatible with next/image.
- Six npm audit findings exist in build tooling (not runtime); noted, not fixed.
- Server-side upload enforcement covers type fully (the format restriction is cryptographically signed, so it can't be bypassed). Size is enforced strictly in the browser (5 MB) but only up to Cloudinary's plan ceiling (~10 MB) on the server — a file between 5 and 10 MB could be uploaded by bypassing the browser. A signed max_file_size preset would close this gap and is the natural next step.
