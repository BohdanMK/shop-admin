import { test, expect } from '@playwright/test';
import { ROUTES, TEST_IDS } from '../constants';

test('create category', async ({ page }) => {
    await page.goto(ROUTES.categories);

    await page.getByTestId(TEST_IDS.categories.openAddModal).click();
    await page.getByTestId(TEST_IDS.categories.title).fill('New Category Title');
    await page.getByTestId(TEST_IDS.categories.uploadImageInput).setInputFiles('e2e/fixtures/sample-image.jpg');
    await page.getByTestId(TEST_IDS.categories.submit).click();

    await expect(page.getByTestId(TEST_IDS.snackbar)).toBeVisible();
});

test('edit category', async ({ page }) => {
    await page.goto(ROUTES.categories);

    await expect(page.getByTestId(TEST_IDS.categories.viewBtn).first()).toBeVisible();
    await page.getByTestId(TEST_IDS.categories.viewBtn).first().click();

    await expect(page.getByTestId(TEST_IDS.categories.openEditModal)).toBeVisible();
    await page.getByTestId(TEST_IDS.categories.openEditModal).click();
    await page.getByTestId(TEST_IDS.categories.title).fill('Updated Category Title');
    await page.getByTestId(TEST_IDS.categories.uploadImageInput).setInputFiles('e2e/fixtures/sample-image.jpg');
    await page.getByTestId(TEST_IDS.categories.submit).click();

    await expect(page.getByTestId(TEST_IDS.snackbar)).toBeVisible();
});


test('delete category' , async ({page}) => {
    await page.goto(ROUTES.categories);

    await page.getByTestId(TEST_IDS.categories.deleteBtn).first().click();

    await expect(page.getByTestId(TEST_IDS.confirmYesBtn)).toBeVisible();
    await page.getByTestId(TEST_IDS.confirmYesBtn).click();

    await expect(page.getByTestId(TEST_IDS.snackbar)).toBeVisible();
})