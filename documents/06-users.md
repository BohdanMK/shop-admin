# Users — Create / Edit

## UserPopUp

**File:** `src/components/users/popup/UserPopUp.tsx`

### Buttons to open popup

| data-testid     | Description                           |
| --------------- | ------------------------------------- |
| `user-open-btn` | Open "Create user" dialog             |
| `user-edit-btn` | Open "Edit user" dialog (icon button) |

### Form fields

| data-testid           | Type           | Description            |
| --------------------- | -------------- | ---------------------- |
| `user-name-input`     | text input     | Full name              |
| `user-username-input` | text input     | Username / login       |
| `user-email-input`    | email input    | Email address          |
| `user-password-input` | password input | Password (create only) |
| `user-role-select`    | select         | User role              |

### Buttons

| data-testid       | Description        |
| ----------------- | ------------------ |
| `user-submit-btn` | Save / create user |

### Snackbar

| data-testid      | data-severity | Description |
| ---------------- | ------------- | ----------- |
| `snackbar-alert` | `success`     | User saved  |
| `snackbar-alert` | `error`       | Save error  |

## Playwright example

```ts
// Create user
await page.getByTestId("user-open-btn").click();
await page.getByTestId("user-name-input").fill("John Doe");
await page.getByTestId("user-username-input").fill("johndoe");
await page.getByTestId("user-email-input").fill("john.doe@example.com");
await page.getByTestId("user-password-input").fill("SecurePass1!");
await page.getByTestId("user-role-select").selectOption("admin");
await page.getByTestId("user-submit-btn").click();
await page.getByTestId("snackbar-alert").waitFor();
```
