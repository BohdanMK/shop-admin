# E2E Test Index

## Products

### Table Actions

| Action | Test ID | Type | Description |
|--------|---------|------|-------------|
| Create | `product-create-btn` | redirect | Redirects to `/products/create` |
| Edit | `product-edit-btn` | redirect | Redirects to `/products/:id/edit` |
| Delete | `product-delete-btn` | action | Deletes product, shows confirm dialog |

### Form Fields

| Field | Test ID |
|-------|---------|
| Name | `product-name-input` |
| Price | `product-price-input` |
| Description | `product-description-input` |
| Category | `product-category-select` |
| Image upload button | `product-image-upload-btn` |
| Image upload input | `product-image-upload-input` |
| Submit | `product-submit-btn` |

### Table Elements

| Element | Test ID |
|---------|---------|
| Product row | `product-item` |
| Product name cell | `product-name` |

---

## Categories

### Table Actions

| Action | Test ID | Type | Description |
|--------|---------|------|-------------|
| Add | `category-open-btn` | modal | Opens create category modal |
| Edit | `category-edit-btn` | modal | Opens edit category modal |
| Delete | `category-delete-btn` | action | Deletes category, shows confirm dialog |
| View | `category-view-btn` | navigate | Opens category detail view |

### Form Fields

| Field | Test ID |
|-------|---------|
| Title | `category-title-input` |
| Image upload button | `category-image-upload-btn` |
| Image upload input | `category-image-upload-input` |
| Submit | `category-submit-btn` |

### Table Elements

| Element | Test ID |
|---------|---------|
| Category row | `category-item` |
| Category name cell | `category-name` |

---

## Shared

| Element | Test ID |
|---------|---------|
| Snackbar alert | `snackbar-alert` |
| Confirm yes | `confirm-yes-btn` |
| Confirm no | `confirm-no-btn` |

---

## Auth

| Element | Test ID |
|---------|---------|
| Username input | `auth-username-input` |
| Password input | `auth-password-input` |
| Submit button | `auth-submit-btn` |
