# Playwright — Notes

## e2e folder structure

```
e2e/
  auth/
    login.spec.ts
  categories/
    categories.spec.ts
  products/
    products.spec.ts
  pages/                     ← Page Object Model (when tests grow)
    LoginPage.ts
    CategoriesPage.ts
  fixtures/
    auth.setup.ts             ← one-time login before all tests
  constants.ts                ← shared routes and test ids
  helpers/
    snackbar.ts               ← reusable assertion helpers
  .auth/
    user.json                 ← stored auth session (gitignored)
```

---

## constants.ts — keep strings here

```ts
export const ROUTES = {
  login: "/login",
  dashboard: "/",
  categories: "/categories",
  products: "/products",
} as const;

export const TEST_IDS = {
  auth: {
    username: "auth-username-input",
    password: "auth-password-input",
    submit: "auth-submit-btn",
  },
  snackbar: "snackbar-alert",
} as const;
```

---

## Locators — how to find an element

A locator describes **how** to find an element. Lookup happens only on `.click()`, `.fill()`, and `expect()`.
Playwright automatically waits for the element to appear (default 5 seconds).

```ts
page.getByTestId("some-id"); // by data-testid ← main strategy in this project
page.getByRole("button", { name: /save/i }); // by role + accessible name
page.getByLabel("Email"); // by label text
page.getByText("Save"); // by visible text
page.locator(".some-class"); // by CSS selector (avoid when possible)
```

---

## Actions

```ts
await locator.fill("text"); // type text
await locator.click(); // click
await locator.selectOption("value"); // select an option in <select>
await locator.setInputFiles("path/img.jpg"); // upload a file
await page.goto("/login"); // navigate to page
await page.waitForURL("/"); // wait for URL change
```

---

## Assertions (expect)

```ts
await expect(page).toHaveURL("/dashboard");
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();
await expect(locator).toHaveValue("text");
await expect(locator).toHaveAttribute("data-severity", "success");
await expect(locator).toContainText("Saved");
```

---

## Test structure

```ts
import { test, expect } from "@playwright/test";
import { ROUTES, TEST_IDS } from "../constants";

test.describe("Group name", () => {
  test("scenario description", async ({ page }) => {
    await page.goto(ROUTES.login);
    await page.getByTestId(TEST_IDS.auth.username).fill("...");
    await expect(page).toHaveURL(ROUTES.dashboard);
  });
});
```

---

## auth.setup.ts — one-time authentication

Runs once before other tests and saves the session to `e2e/.auth/user.json`.
All other tests reuse that session and are already authenticated.

```ts
import { test as setup } from "@playwright/test";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("auth-username-input").fill(process.env.E2E_USERNAME!);
  await page.getByTestId("auth-password-input").fill(process.env.E2E_PASSWORD!);
  await page.getByTestId("auth-submit-btn").click();
  await page.waitForURL("/");
  await page.context().storageState({ path: "e2e/.auth/user.json" });
});
```

If a test does not require authentication (for example `login.spec.ts`), reset the storage state at the top of the file:

```ts
test.use({ storageState: { cookies: [], origins: [] } });
```

---

## Intercepting browser alert()

```ts
page.once("dialog", async (dialog) => {
  expect(dialog.message()).toContain("Login error");
  await dialog.accept(); // always accept alert(), not dismiss
});
await locator.click();
```

---

## File upload

```ts
await page
  .getByTestId("category-image-upload-input")
  .setInputFiles("e2e/fixtures/test.jpg");
```

---

## Page Object Model (POM) — when tests grow

A class that groups locators and actions for a single page:

```ts
// e2e/pages/LoginPage.ts
import { Page } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  username = this.page.getByTestId("auth-username-input");
  password = this.page.getByTestId("auth-password-input");
  submitBtn = this.page.getByTestId("auth-submit-btn");

  async goto() {
    await this.page.goto("/login");
  }

  async login(u: string, p: string) {
    await this.username.fill(u);
    await this.password.fill(p);
    await this.submitBtn.click();
  }
}
```

```ts
// in a test
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login(process.env.E2E_USERNAME!, process.env.E2E_PASSWORD!);
```

---

## Snackbar helper

```ts
// e2e/helpers/snackbar.ts
import { Page, expect } from "@playwright/test";

export async function expectSuccess(page: Page) {
  const alert = page.getByTestId("snackbar-alert");
  await expect(alert).toBeVisible();
  await expect(alert).toHaveAttribute("data-severity", "success");
}

export async function expectError(page: Page) {
  const alert = page.getByTestId("snackbar-alert");
  await expect(alert).toBeVisible();
  await expect(alert).toHaveAttribute("data-severity", "error");
}
```

---

## Run commands

```bash
npx playwright test                          # all tests
npx playwright test e2e/auth/login.spec.ts   # single file
npx playwright test --ui                     # UI mode (recommended for development)
```

---

## .env variables for tests

```
E2E_USERNAME='bohdan@gmail.com'
E2E_PASSWORD='123123'
```

Playwright loads `.env` automatically. Access via `process.env.E2E_USERNAME`

---

## .gitignore

```
e2e/.auth/
```
