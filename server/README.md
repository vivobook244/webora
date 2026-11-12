# CMS Lite — Backend (Server)

The Express backend API will be implemented in a future module.

## Planned Stack

- Node.js + Express
- MongoDB (via Mongoose)
- REST API
- Cookie/session authentication

## Planned Endpoints

### Auth

- `POST /api/auth/login` — Login with email & password
- `POST /api/auth/logout` — Clear session
- `GET  /api/auth/me` — Get current authenticated user

### Settings

- `GET /api/settings` — Retrieve site settings
- `PUT /api/settings` — Update site settings

## Response Contract

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

## Status

Not yet implemented. The frontend currently runs on dummy JSON data and localStorage.
