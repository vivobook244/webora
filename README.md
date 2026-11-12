# Webora

Webora is a lightweight Content Management System for building and managing company profile, institutional, and landing-page websites through structured templates, pages, sections, variants, and content.

It intentionally avoids arbitrary HTML/CSS/JavaScript editing and keeps the website-building workflow structured and predictable.

## Current Architecture

- React + Vite + JavaScript
- Tailwind CSS
- React Router
- Dummy JSON + localStorage for structured application data
- IndexedDB for uploaded image files
- API service layer prepared for a future backend (not used by the UI yet)

## Requirements

- Node.js 20.19+
- npm

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build and Preview

```bash
npm run build
npm run preview
```

## Quality Checks

```bash
npm test
npm run lint
npm run build
```

GitHub Actions also runs dependency auditing, core tests, lint, and a production build on pushes to `main` and pull requests.

## Demo Credentials

- Email: `admin@example.com`
- Password: `admin123`

The demo login is frontend-only and must not be used as production authentication.

## Environment

See `.env.example` for `VITE_API_URL`. The API URL is reserved for future backend integration. The current UI continues to use dummy services.

All `VITE_*` variables are exposed to the browser. Never put secrets, passwords, or private tokens in frontend environment variables.

## Current Data Flow

```
Dummy JSON → Dummy Service → React UI → localStorage
                                  └── IndexedDB (uploaded media files)
```

## Future Data Flow

```
React UI → API Service → Express API → MongoDB
```

The API service layer is prepared but is not called by the UI yet.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── public/       # Public website renderers
├── layouts/          # Admin and public layouts
├── pages/            # Admin, preview, and public pages
├── services/
│   ├── api/          # Prepared API abstraction (unused)
│   └── dummy/        # Active frontend data services
├── data/             # Initial dummy JSON and configuration
├── lib/              # Auth, storage, validation, IndexedDB media
├── App.jsx
└── main.jsx
```

## Website Rendering

The active template controls available public sections and whether the shared public header/footer are rendered. Appearance settings are exposed as shared CSS variables and applied to the public renderer. Admin Preview and Public Website use the same `PublicLayout` and `PageRenderer` components and load the same page list for navigation.

## Browser Storage

Structured data is stored in localStorage. Uploaded image blobs are stored in IndexedDB; localStorage stores only media metadata and the IndexedDB asset key. Media URLs are recreated when the application loads.

Browser storage remains local to a browser profile and device. Clearing browser data removes the prototype's content and uploaded files. Export, backup, multi-device synchronization, and server-side media storage are future backend work.

## SPA Deployment

Webora uses client-side routing. The repository includes:

- `vercel.json` for Vercel SPA rewrites.
- `public/_redirects` for Netlify SPA fallback.

For other static hosting providers, configure all non-asset routes to serve `index.html`.

## Current Limitations

**This repository is a frontend prototype, not a production multi-user CMS.**

- Authentication is a demo-only local session with a 12-hour expiry. It is not a security boundary.
- Role checks are frontend-only. Server-side authentication and authorization do not exist yet.
- Application records are browser-local and are not synchronized between devices.
- Uploaded media is stored in browser IndexedDB, not in a shared object-storage service.
- SEO metadata is updated client-side. Search engines and social crawlers may require server rendering or prerendering for reliable metadata discovery.
- There is no production database, server-side validation, backup service, or audit log.

Before production multi-user use, implement the planned Express backend, cookie/session authentication, server-side authorization, database persistence, shared media storage, backups, and operational monitoring.

## localStorage Keys

- `cms_lite_auth` — demo session
- `cms_lite_site_settings` — site settings
- `cms_lite_media` — media metadata
- `cms_lite_active_template` — active template ID
- `cms_lite_pages` — pages
- `cms_lite_sections` — sections
- `cms_lite_navigation` — navigation items
- `cms_lite_appearance` — appearance settings
- `cms_lite_seo` — SEO settings

Uploaded image blobs are stored separately in IndexedDB database `webora_media`.
