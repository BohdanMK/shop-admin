import { test, expect } from "@playwright/test";
import { ROUTES, TEST_IDS } from "../constants";

test("create product", async ({ page }) => {
  await page.goto(ROUTES.products);

  await page.getByTestId(TEST_IDS.products.createBtn).click();

  await page
    .getByTestId(TEST_IDS.products.uploadImageInput)
    .setInputFiles("e2e/fixtures/sample-image.jpg");
  await page.getByTestId(TEST_IDS.products.imageAlt).fill("New Product Image");
  await page.getByTestId(TEST_IDS.products.title).fill("New Product Title");
  await page.getByTestId(TEST_IDS.products.price).fill("100");

  await page.getByTestId(TEST_IDS.products.onSale).click();
  await page.getByTestId(TEST_IDS.products.salePrice).fill("80");

  const subCategoriesResponse = page.waitForResponse(
    (resp) => resp.url().includes("/subcategories") && resp.status() === 200,
  );

  await page.getByTestId(TEST_IDS.products.category).click();
  await page.getByRole("listbox").getByRole("option").last().click();

  // Open subcategory select while API is still in-flight — keeps it open while data loads
  await page.getByTestId(TEST_IDS.products.subCategory).click();

  const response = await subCategoriesResponse;
  const subCatData = await response.json();
  expect(subCatData.length).toBeGreaterThan(0);

  await page.getByRole("listbox").getByRole("option").first().click();

  await page.getByTestId(TEST_IDS.products.submit).click();

  await expect(page.getByTestId(TEST_IDS.snackbar)).toBeVisible();
});

test("edit product", async ({ page }) => {
  await page.goto(ROUTES.products);

  await expect(
    page.getByTestId(TEST_IDS.products.editBtn).first(),
  ).toBeVisible();
  await page.getByTestId(TEST_IDS.products.editBtn).first().click();
  await page.getByTestId(TEST_IDS.products.title).fill("Updated Product Title");
  await page.getByTestId(TEST_IDS.products.price).fill("150");
  await page.getByTestId(TEST_IDS.products.submit).click();
  await expect(page.getByTestId(TEST_IDS.snackbar)).toBeVisible();
});

test("edit product components", async ({ page }) => {
  await page.goto(ROUTES.products);
  await expect(
    page.getByTestId(TEST_IDS.products.editBtn).first(),
  ).toBeVisible();
  await page.getByTestId(TEST_IDS.products.editBtn).first().click();
  await page.getByTestId(TEST_IDS.products.tabComponents).click();

  // Add new component
  //   await page.getByTestId(TEST_IDS.products.addComponentBtn).click();
  await page
    .getByTestId(TEST_IDS.products.componentImageUploadInput)
    .last()
    .setInputFiles("e2e/fixtures/sample-image.jpg");
  await page
    .getByTestId(TEST_IDS.products.componentNameInput)
    .last()
    .fill("New Component");
  await page
    .getByTestId(TEST_IDS.products.componentImageAltInput)
    .last()
    .fill("Component Image Alt");
  await page.getByTestId(TEST_IDS.products.componentsSubmit).click();

  await expect(page.getByTestId(TEST_IDS.snackbar)).toBeVisible();
});

test("edit product options", async ({ page }) => {
  await page.goto(ROUTES.products);
  await expect(
    page.getByTestId(TEST_IDS.products.editBtn).first(),
  ).toBeVisible();
  await page.getByTestId(TEST_IDS.products.editBtn).first().click();
  await page.getByTestId(TEST_IDS.products.tabOptions).click();

  // Add new option group
  await page.getByTestId(TEST_IDS.products.addOptionGroupBtn).click();
  await page
    .getByTestId(TEST_IDS.products.optionGroupNameInput)
    .last()
    .fill("New Option Group");
  await page
    .getByTestId(TEST_IDS.products.optionGroupTypeSelect)
    .last()
    .selectOption("multiple");

  // Add new option value
  await page
    .getByTestId(TEST_IDS.products.optionValueLabelInput)
    .last()
    .fill("New Option Value");
  await page
    .getByTestId(TEST_IDS.products.optionValueExtraPriceInput)
    .last()
    .fill("20");
  await page.getByTestId(TEST_IDS.products.optionsSubmit).click();

  await expect(page.getByTestId(TEST_IDS.snackbar)).toBeVisible();
});

test("delete product", async ({ page }) => {
  await page.goto(ROUTES.products);
  await page.getByTestId(TEST_IDS.products.deleteBtn).first().click();

  await expect(page.getByTestId(TEST_IDS.confirmYesBtn)).toBeVisible();
  await page.getByTestId(TEST_IDS.confirmYesBtn).click();
  await expect(page.getByTestId(TEST_IDS.snackbar)).toBeVisible();
});
