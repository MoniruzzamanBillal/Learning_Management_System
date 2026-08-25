# 21. Sign-up registration payload format bug

## Goal

Fix the public sign-up form (`/sign-up`) so a new user can actually register. Found while testing the end-to-end purchase/watch/certificate/review flow as a real user (`user1@gmail.com`) — sign-up failed with a raw 500 on the very first step.

## How found

Playwright-driven UI test: filled the sign-up form (name/email/password) and submitted. Toast showed `"undefined" is not valid JSON` and the network request returned `500`. Reproduced directly with curl:

```
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Tanvir Uddin Alif","email":"user1@gmail.com","password":"123456"}'
# -> 500, "\"undefined\" is not valid JSON"
```

## Root cause

`POST /auth/register` (`lms_server/src/app/modules/auth/auth.route.ts:14-23`) is built around `multer`'s `upload.single("profileImg")` plus an inline middleware that does `req.body = JSON.parse(req.body?.data)` — the same pattern used by `/auth/register-instructor`, which legitimately supports an optional profile-image upload (see `AddInstructor.tsx`, which sends a `FormData` with a `data` field containing the JSON payload, exactly matching this contract).

`components/main/SignUp/SignUpPage.tsx` (formerly inline in `app/(main)/sign-up/page.tsx`), however, calls `usePost` with the raw form object as `payload` — a plain JS object, not `FormData`. `lib/axiosInstance.ts` only switches to `multipart/form-data` when `config.data instanceof FormData` (`lib/axiosInstance.ts:21-28`); otherwise it sends `application/json`. So the request arrives as JSON, `req.body?.data` is `undefined`, and `JSON.parse(undefined)` throws (`JSON.parse` coerces to the string `"undefined"`, which isn't valid JSON).

Net effect: **every public sign-up attempt through the real UI has always failed with a 500** — this form was never wired to match its own backend's expected contract. There is no image field on the sign-up form (unlike `AddInstructor`), so it never had a reason to send `FormData` — it's a plain payload mismatch, not a missing-feature.

## Fix

Match the same `FormData` + `data` field contract every other create-user endpoint already uses (`AddInstructor.tsx` is the precedent) — send `payload` as `FormData` containing just a `data` field with the JSON-stringified `{name, email, password}`, no file. No backend change needed; the multer middleware already tolerates a request with no file attached (`register-instructor` is called this way whenever no `profileImg` is chosen).

`components/main/SignUp/SignUpPage.tsx`, `onSubmit`:

```ts
const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    const result = await registerMutation.mutateAsync({
      url: "/auth/register",
      payload: formData,
    });
    ...
```

## Verify when done

- [ ] `curl` to `/auth/register` with a `FormData`-shaped multipart body (data field) succeeds with 200 and creates a user.
- [ ] Real UI sign-up (`/sign-up`) with `user1@gmail.com` / `Tanvir Uddin Alif` / `123456` succeeds, toasts success, redirects to `/login`.
- [ ] Login with the new account succeeds.
- [ ] `yarn lint` clean on the touched file.
