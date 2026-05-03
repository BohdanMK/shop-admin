# Products — Create / Edit / Filter

## ProductForm

**File:** `src/components/product/ProductForm.tsx`

| data-testid          | Description  |
| -------------------- | ------------ |
| `product-submit-btn` | Save product |

---

## ProductFormMain

**File:** `src/components/product/productForm/ProductFormMain.tsx`

| data-testid                  | Type              | Description                             |
| ---------------------------- | ----------------- | --------------------------------------- |
| `product-title-input`        | text input        | Product title                           |
| `product-price-input`        | number input      | Price                                   |
| `product-currency-input`     | text input        | Currency                                |
| `product-weight-input`       | number input      | Weight                                  |
| `product-cta-input`          | text input        | Call-to-action text                     |
| `product-sale-price-input`   | number input      | Sale price (shown when isOnSale = true) |
| `product-on-sale-switch`     | checkbox (switch) | Toggle sale status                      |
| `product-category-select`    | select            | Category picker                         |
| `product-subcategory-select` | select            | Subcategory picker                      |

---

## ProductFormMedia

**File:** `src/components/product/productForm/ProductFormMedia.tsx`

| data-testid                  | Type              | Description           |
| ---------------------------- | ----------------- | --------------------- |
| `product-image-alt-input`    | text input        | Image alt text        |
| `product-image-upload-btn`   | button            | Open file picker      |
| `product-image-upload-input` | hidden file input | `<input type="file">` |

---

## ProductComponentForm (add-ons / components)

**File:** `src/components/product/ProductComponentForm.tsx`

| data-testid                     | Description              |
| ------------------------------- | ------------------------ |
| `product-add-component-btn`     | Add a new component item |
| `product-components-submit-btn` | Save all components      |

### Per-component fields (index = 0, 1, 2…)

| data-testid                            | Type              | Description           |
| -------------------------------------- | ----------------- | --------------------- |
| `component-{index}-name-input`         | text input        | Component name        |
| `component-{index}-image-alt-input`    | text input        | Image alt text        |
| `component-{index}-image-upload-btn`   | button            | Pick component image  |
| `component-{index}-image-upload-input` | hidden file input | `<input type="file">` |
| `component-{index}-delete-btn`         | icon button       | Remove this component |

---

## ProductOptionsForm (option groups)

**File:** `src/components/product/ProductOptionsForm.tsx`

| data-testid                    | Description            |
| ------------------------------ | ---------------------- |
| `product-add-option-group-btn` | Add new option group   |
| `product-options-submit-btn`   | Save all option groups |

### Per-group fields (groupIndex = 0, 1…)

| data-testid                             | Type          | Description             |
| --------------------------------------- | ------------- | ----------------------- |
| `option-group-{groupIndex}-name-input`  | text input    | Group name              |
| `option-group-{groupIndex}-type-select` | native select | Type: single / multiple |
| `option-group-{groupIndex}-delete-btn`  | icon button   | Remove this group       |

### Per-value fields (valueIndex = 0, 1…)

| data-testid                                                      | Type         | Description            |
| ---------------------------------------------------------------- | ------------ | ---------------------- |
| `option-group-{groupIndex}-value-{valueIndex}-label-input`       | text input   | Value label            |
| `option-group-{groupIndex}-value-{valueIndex}-extra-price-input` | number input | Extra price            |
| `option-group-{groupIndex}-value-{valueIndex}-delete-btn`        | icon button  | Remove this value      |
| `option-group-{groupIndex}-add-value-btn`                        | button       | Add new value to group |

---

## ProductsFilter drawer

**File:** `src/components/product/ProductsFilter.tsx`

| data-testid                        | Type          | Description          |
| ---------------------------------- | ------------- | -------------------- |
| `products-filter-open-btn`         | button        | Open filter drawer   |
| `products-filter-search-input`     | text input    | Search by name       |
| `products-filter-category-select`  | native select | Filter by category   |
| `products-filter-on-sale-checkbox` | checkbox      | Show only discounted |
| `products-filter-reset-btn`        | button        | Reset filters        |
| `products-filter-apply-btn`        | button        | Apply filters        |

---

## ProductsOptions popup (standalone option-group editor)

**File:** `src/components/products/popup/ProductsOptions.tsx`

| data-testid                              | Type         | Description            |
| ---------------------------------------- | ------------ | ---------------------- |
| `option-group-open-btn`                  | button       | Open create dialog     |
| `option-group-edit-btn`                  | icon button  | Open edit dialog       |
| `option-group-name-input`                | text input   | Option group name      |
| `option-group-type-single`               | radio        | Type = single-choice   |
| `option-group-type-multiple`             | radio        | Type = multiple-choice |
| `option-group-required-checkbox`         | checkbox     | Is selection required  |
| `option-group-min-selected-input`        | number input | Min selections         |
| `option-group-max-selected-input`        | number input | Max selections         |
| `option-value-{index}-label-input`       | text input   | Value label            |
| `option-value-{index}-description-input` | text input   | Value description      |
| `option-value-{index}-extra-price-input` | number input | Extra price            |
| `option-value-{index}-remove-btn`        | icon button  | Remove value           |
| `option-add-value-btn`                   | button       | Add value              |
| `option-group-submit-btn`                | button       | Save option group      |

## Playwright example

```ts
// Create product
await page.getByTestId("product-title-input").fill("Pizza");
await page.getByTestId("product-price-input").fill("250");
await page
  .getByTestId("product-category-select")
  .selectOption({ label: "Pizza" });
await page.getByTestId("product-submit-btn").click();
await page.getByTestId("snackbar-alert").waitFor();

// Filter by sale
await page.getByTestId("products-filter-open-btn").click();
await page.getByTestId("products-filter-on-sale-checkbox").check();
await page.getByTestId("products-filter-apply-btn").click();

// Add component
await page.getByTestId("product-add-component-btn").click();
await page.getByTestId("component-0-name-input").fill("Cheese");
await page.getByTestId("product-components-submit-btn").click();
```
