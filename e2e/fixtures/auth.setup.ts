// e2e/fixtures/auth.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('auth-username-input').fill('bohdan@gmail.com');
    await page.getByTestId('auth-password-input').fill('123123');
    await page.getByTestId('auth-submit-btn').click();
    await page.waitForURL('/');
    await page.context().storageState({ path: 'e2e/.auth/user.json' });
});
