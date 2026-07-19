# 15 — Refresh-token rotation (stretch)

## Goal

Replace the current single long-lived JWT with a short-lived access token + rotating refresh token pair — a standard "I understand auth security" talking point, and a real gap: today `auth.util.ts` signs one token with `expiresIn: "20d"` and there is no revocation mechanism, no refresh flow, and only one secret (`JWT_ACCESS_SECRET`) configured at all.

## Current State

- `auth.service.ts::signInFromDb` → `createToken(jwtPayload, config.jwt_secret, ...)` — one token, 20-day expiry, returned directly in the login response body (not currently a cookie — confirm this against `lms_client`'s `constants/storageKey.ts`/cookie handling, which stores `accessToken` client-side).
- No refresh endpoint, no token blacklist/revocation store, no distinction between access and refresh secrets in `config/index.ts`.
- This is the largest/riskiest spec in this manifest — it touches both apps' auth flow end-to-end and has real potential to break login if done carelessly. Treat as genuinely optional/stretch, not a quick win.

## Implementation

1. `config/index.ts` — add `jwt_refresh_secret` and `jwt_refresh_expires_in` (e.g. `30d`) alongside the existing access-token config; shorten `jwt_access_expires_in` to something like `15m`–`1h`.
2. `auth.util.ts` — add `createRefreshToken(payload, secret, expiresIn)` alongside the existing `createToken`.
3. `auth.service.ts::signInFromDb` — issue both an access token and a refresh token on login. Store the refresh token as an `httpOnly` cookie (new behavior — confirm CORS `credentials: true` already supports this, which `app.ts` already has configured) rather than returning it in the JSON body, so it isn't exposed to client-side JS/XSS.
4. New route `POST /auth/refresh-token` — reads the refresh-token cookie, verifies against `jwt_refresh_secret`, issues a new access token (and optionally rotates the refresh token itself — "rotation" proper means invalidating the old refresh token and issuing a new one each use, which requires persisting issued refresh tokens somewhere, e.g. a new `RefreshToken` collection or a `tokenVersion` field on `User` that increments to invalidate all outstanding tokens at once — the `tokenVersion` approach is simpler and sufficient for this app's scale).
5. `lms_client` changes (companion work, not in this backend spec's scope but required for this to function): the Axios response interceptor (`utils/axiosInstance.ts`) needs a 401-triggered silent call to `/auth/refresh-token` before falling back to force-logout, and `middleware.ts`'s JWT decode logic needs to account for the shorter access-token expiry.

## Dependencies

- No new packages — uses the existing `jsonwebtoken` library, just two secrets/tokens instead of one.

## Verify When Done

- [ ] `yarn build` and `yarn lint` clean.
- [ ] Login issues a short-lived access token + httpOnly refresh cookie.
- [ ] Access token expiring mid-session triggers a silent refresh (frontend companion change) rather than forcing a full re-login.
- [ ] Logging out (or bumping `tokenVersion`) invalidates the refresh token — a stolen/leaked refresh token stops working after that point.
- [ ] Full regression pass on login/logout/protected-route access in both apps before considering this done — this spec has the highest blast radius of anything in this manifest.
