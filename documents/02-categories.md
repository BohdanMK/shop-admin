# Categories — Create / Edit / Filter

## CategoryItem popup (Create & Edit)

**File:** `src/components/categories/popup/CategoryItem.tsx`

### Buttons to open popup

| data-testid         | Description                   |
| ------------------- | ----------------------------- |
| `category-open-btn` | Open "Create category" dialog |
| `category-edit-btn` | Open "Edit category" dialog   |

### Form fields

| data-testid                   | Type              | Description                  |
| ----------------------------- | ----------------- | ---------------------------- |
| `category-title-input`        | text input        | Category title               |
| `category-image-upload-btn`   | button            | Click to pick image file     |
| `category-image-upload-input` | hidden file input | Hidden `<input type="file">` |

### Buttons

| data-testid           | Description            |
| --------------------- | ---------------------- |
| `category-submit-btn` | Save / create category |

### Snackbar

| data-testid      | data-severity | Description    |
| ---------------- | ------------- | -------------- |
| `snackbar-alert` | `success`     | Category saved |
| `snackbar-alert` | `error`       | Save error     |

---

## SubCategoryItem popup (Create & Edit)

**File:** `src/components/categories/popup/SubCategoryItem.tsx`

### Buttons to open popup

| data-testid            | Description                      |
| ---------------------- | -------------------------------- |
| `subcategory-open-btn` | Open "Create subcategory" dialog |
| `subcategory-edit-btn` | Edit subcategory (icon button)   |

### Form fields

| data-testid               | Type       | Description       |
| ------------------------- | ---------- | ----------------- |
| `subcategory-title-input` | text input | Subcategory title |

### Buttons

| data-testid              | Description               |
| ------------------------ | ------------------------- |
| `subcategory-submit-btn` | Save / create subcategory |

---

## CategoriesFilter drawer

**File:** `src/components/categories/CategoriesFilter.tsx`

| data-testid                      | Type       | Description        |
| -------------------------------- | ---------- | ------------------ |
| `categories-filter-open-btn`     | button     | Open filter drawer |
| `categories-filter-search-input` | text input | Search by name     |
| `categories-filter-reset-btn`    | button     | Reset filters      |
| `categories-filter-apply-btn`    | button     | Apply filters      |

## Playwright example

```ts
// Create category
await page.getByTestId("category-open-btn").click();
await page.getByTestId("category-title-input").fill("New Category");
await page.getByTestId("category-image-upload-btn").click();
await page.getByTestId("category-submit-btn").click();
await page.getByTestId("snackbar-alert").waitFor();

// Filter
await page.getByTestId("categories-filter-open-btn").click();
await page.getByTestId("categories-filter-search-input").fill("New");
await page.getByTestId("categories-filter-apply-btn").click();
```
