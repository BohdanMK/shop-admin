# AuthForm — Login

**File:** `src/components/AuthForm.tsx`

## Inputs

| data-testid | Type | Description |
|---|---|---|
| `auth-username-input` | text input | Username field |
| `auth-password-input` | password input | Password field |

## Buttons

| data-testid | Description |
|---|---|
| `auth-submit-btn` | Submit login form |

## Snackbar

| data-testid | data-severity | Description |
|---|---|---|
| `snackbar-alert` | `error` | Login failed notification |

## Playwright example

```ts
await page.getByTestId('auth-username-input').fill('admin')
await page.getByTestId('auth-password-input').fill('password')
await page.getByTestId('auth-submit-btn').click()
await page.getByTestId('snackbar-alert').waitFor()
```
