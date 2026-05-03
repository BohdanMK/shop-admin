// e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test';

// Цей файл НЕ використовує збережену сесію — тестуємо саму форму логіну
test.use({ storageState: { cookies: [], origins: [] } });

test('успішний логін — редірект на дашборд', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('auth-username-input').fill(process.env.E2E_USERNAME!);
  await page.getByTestId('auth-password-input').fill(process.env.E2E_PASSWORD!);
  await page.getByTestId('auth-submit-btn').click();

  await expect(page).toHaveURL('/');
});

test('невірний пароль — показує alert з помилкою', async ({ page }) => {
  await page.goto('/login');

  // Перехоплюємо браузерний alert до кліку
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Login error');
    await dialog.accept();
  });

  await page.getByTestId('auth-username-input').fill('admin');
  await page.getByTestId('auth-password-input').fill('wrongpassword');
  await page.getByTestId('auth-submit-btn').click();

  await expect(page).toHaveURL('/login');
});
