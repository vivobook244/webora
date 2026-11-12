# CMS Lite

A simple Content Management System for building and managing company profile / landing page websites.

## Tech Stack

- React + Vite
- Tailwind CSS
- React Router
- Dummy JSON + localStorage (temporary data layer)

## Requirements

- Node.js 18+
- npm

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview (Production Build)

```bash
npm run build
npm run preview
```

## Lint

```bash
npm run lint
```

## Demo Credentials

- Email: `admin@example.com`
- Password: `admin123`

## Environment

See `.env.example`:

```
VITE_API_URL=http://localhost:3001/api
```

The API URL is preparation for a future backend. The UI does not call it yet, so the app works fine without it. All `VITE_*` variables are exposed to the browser — never put secrets, passwords, or private tokens in frontend environment variables.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── public/       # Public website renderers
│   └── sections/     # Admin section preview components
├── layouts/          # Layout wrappers (AdminLayout, PublicLayout)
├── pages/            # Route pages
├── services/
│   ├── api/          # API abstraction layer (prepared, not yet used)
│   └── dummy/        # Dummy data services (active data source)
├── data/             # Dummy JSON initial data
├── lib/              # Auth context, hooks, storage, validation utilities
├── App.jsx           # Router + route definitions
└── main.jsx          # App entry point
```

## Data Flow (Current)

```
Dummy JSON → Dummy Service → React UI → localStorage
```

## Data Flow (Future)

```
React UI → API Service → Express API → MongoDB
```

The API service layer is prepared but not called by the UI yet.

## SPA Routing

CMS Lite uses client-side routing. When deploying to static hosting, configure a fallback so all routes serve `index.html`:

```
/* → /index.html
```

This is required for direct access and page refreshes on routes like `/admin/pages`, `/about-us`, etc.

### Static Hosting

The app is compatible with static hosting platforms that support SPA fallback:

- Vercel: add a `vercel.json` with `rewrites` rule for `/*` to `/index.html`
- Netlify: add a `_redirects` file with `/* /index.html 200`
- Cloudflare Pages: set SPA fallback in project settings
- Other: configure fallback to `index.html` for all non-asset routes

## Deployment Limitations

**CMS Lite is frontend-only.** This version is NOT production-ready for multi-user use.

- Data is stored in the browser via localStorage — it is browser-specific, device-specific, and can be cleared by the user at any time
- Authentication is dummy/localStorage-based — it is not secure for production
- Backend and API are not implemented — the API service layer exists only as preparation
- localStorage is not suitable for a production database, multi-user scenarios, or backups
- Role-based access control exists only for UI behavior, not as a security boundary

### Security Notes

- Module 14 performs frontend security hardening only (input validation, URL sanitization, XSS prevention, localStorage safety, error boundaries)
- This does NOT make the app production-secure — it reduces common frontend risks
- The following must be implemented before production use:
  - Real backend authentication (JWT, sessions)
  - Server-side data validation and authorization
  - Database (MongoDB or equivalent)
  - Secure file upload handling
  - HTTPS enforcement

### Known Dependency Vulnerabilities

`npm audit` reports vulnerabilities in devDependencies (tailwindcss, vite/esbuild) and react-router-dom v6. Fixes require major version upgrades (tailwindcss 4, vite 8, react-router 7) which are breaking changes. These do not affect production builds since vulnerable packages are build-time only or the vulnerabilities require specific attack conditions.

## localStorage Keys

The app uses these localStorage keys:

- `cms_lite_auth` — dummy session
- `cms_lite_site_settings` — site settings
- `cms_lite_media` — media library
- `cms_lite_active_template` — active template ID
- `cms_lite_pages` — pages
- `cms_lite_sections` — sections
- `cms_lite_navigation` — navigation items
- `cms_lite_appearance` — appearance settings
- `cms_lite_seo` — SEO settings

All localStorage reads use try/catch with fallback to default data. Corrupt data in one key does not affect other keys.

## Features

- Admin authentication (dummy)
- Dashboard with statistics
- Site settings management
- Media library (image upload simulation, 5 MB limit)
- Template system with activation
- Page management with slug validation, status control, and homepage assignment
- Section builder with 10 section types: Hero, About, Services, Gallery, Testimonial, CTA, Contact, Rich Text, Image + Text, FAQ
- Section variants per type
- Navigation management (page links, custom URLs, 2-level nesting)
- Appearance customization (colors, typography, layout, radius) with live preview
- SEO settings (site title, description, keywords, robots, Open Graph, Twitter Card)
- Page preview (draft and published states)
- Publish/unpublish workflow
- Public website rendering with responsive design
- Error boundary for crash recovery
- Input validation and URL sanitization throughout
