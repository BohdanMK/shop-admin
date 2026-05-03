# Snackbar — Global Notification System

**File:** `src/context/SnackbarContext.tsx`

All notifications in the application are rendered by the global `SnackbarContext`. Every `showSnackbar()` call renders an MUI `Alert` element with the following attributes:

## HTML attributes on the Alert element

| Attribute       | Values                                      | Description                 |
| --------------- | ------------------------------------------- | --------------------------- |
| `data-testid`   | `snackbar-alert` (default) or custom value  | Identifies the notification |
| `data-severity` | `success` \| `error` \| `warning` \| `info` | Severity level              |

## Custom `dataTestId`

Each `showSnackbar` call can pass a custom `dataTestId` to distinguish between different notification types:

```ts
showSnackbar({
  message: "Saved",
  severity: "success",
  dataTestId: "product-save-snackbar", // optional
});
```

If `dataTestId` is omitted, the alert renders with `data-testid="snackbar-alert"`.

## Playwright usage

```ts
// Wait for any notification
await page.getByTestId("snackbar-alert").waitFor();

// Assert severity
await expect(page.getByTestId("snackbar-alert")).toHaveAttribute(
  "data-severity",
  "success",
);

// Wait for specific named notification
await page.getByTestId("product-save-snackbar").waitFor();

// Combined selector (CSS attribute)
await page
  .locator('[data-testid="snackbar-alert"][data-severity="error"]')
  .waitFor();
```

## Standard test pattern

```ts
// After any form submit:
const snackbar = page.getByTestId("snackbar-alert");
await snackbar.waitFor({ state: "visible" });
await expect(snackbar).toHaveAttribute("data-severity", "success");
await snackbar.waitFor({ state: "hidden" }); // auto-hides after duration
```
