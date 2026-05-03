# Playwright Test Reference — data-testid Index

All `data-testid` attributes added across the project for automated testing.

## Documents

| File                                             | Topic                                                  |
| ------------------------------------------------ | ------------------------------------------------------ |
| [01-auth-form.md](01-auth-form.md)               | Login form                                             |
| [02-categories.md](02-categories.md)             | Categories & subcategories (create / edit / filter)    |
| [03-products.md](03-products.md)                 | Products, components, options (create / edit / filter) |
| [04-locations.md](04-locations.md)               | Locations (create / edit)                              |
| [05-orders.md](05-orders.md)                     | Orders filter                                          |
| [06-users.md](06-users.md)                       | Users (create / edit)                                  |
| [07-company-settings.md](07-company-settings.md) | Company settings (main / about / banners)              |
| [08-snackbar.md](08-snackbar.md)                 | Global snackbar / notification system                  |

---

## Quick reference — all data-testid values

### Auth

- `auth-username-input`, `auth-password-input`, `auth-submit-btn`

### Categories

- `category-open-btn`, `category-edit-btn`
- `category-title-input`, `category-image-upload-btn`, `category-image-upload-input`
- `category-submit-btn`
- `subcategory-open-btn`, `subcategory-edit-btn`
- `subcategory-title-input`, `subcategory-submit-btn`
- `categories-filter-open-btn`, `categories-filter-search-input`
- `categories-filter-reset-btn`, `categories-filter-apply-btn`

### Products

- `product-title-input`, `product-price-input`, `product-currency-input`
- `product-weight-input`, `product-cta-input`, `product-sale-price-input`
- `product-on-sale-switch`
- `product-category-select`, `product-subcategory-select`
- `product-image-alt-input`, `product-image-upload-btn`, `product-image-upload-input`
- `product-submit-btn`
- `product-add-component-btn`, `product-components-submit-btn`
- `component-{i}-name-input`, `component-{i}-image-alt-input`
- `component-{i}-image-upload-btn`, `component-{i}-image-upload-input`
- `component-{i}-delete-btn`
- `product-add-option-group-btn`, `product-options-submit-btn`
- `option-group-{g}-name-input`, `option-group-{g}-type-select`, `option-group-{g}-delete-btn`
- `option-group-{g}-value-{v}-label-input`, `option-group-{g}-value-{v}-extra-price-input`
- `option-group-{g}-value-{v}-delete-btn`, `option-group-{g}-add-value-btn`
- `products-filter-open-btn`, `products-filter-search-input`
- `products-filter-category-select`, `products-filter-on-sale-checkbox`
- `products-filter-reset-btn`, `products-filter-apply-btn`
- `option-group-open-btn`, `option-group-edit-btn`
- `option-group-name-input`, `option-group-type-single`, `option-group-type-multiple`
- `option-group-required-checkbox`
- `option-group-min-selected-input`, `option-group-max-selected-input`
- `option-value-{i}-label-input`, `option-value-{i}-description-input`
- `option-value-{i}-extra-price-input`, `option-value-{i}-remove-btn`
- `option-add-value-btn`, `option-group-submit-btn`
- `product-tab-base`, `product-tab-components`, `product-tab-options`
- `product-tabpanel-base`, `product-tabpanel-components`, `product-tabpanel-options`

### Locations

- `location-name-input`, `location-address-input`, `location-description-input`
- `location-schedule-input`, `location-type-select`
- `location-image-alt-input`, `location-image-upload-btn`, `location-image-upload-input`
- `location-lat-input`, `location-lng-input`
- `location-phone-{i}-input`, `location-phone-{i}-delete-btn`, `location-add-phone-btn`
- `location-submit-btn`

### Orders

- `orders-filter-open-btn`, `orders-filter-name-input`
- `orders-filter-status-select`, `orders-filter-reset-btn`, `orders-filter-apply-btn`

### Users

- `user-open-btn`, `user-edit-btn`
- `user-name-input`, `user-username-input`, `user-email-input`, `user-password-input`
- `user-role-select`, `user-submit-btn`

### Company Settings

- `company-title-input`, `company-logo-alt-input`
- `company-logo-upload-btn`, `company-logo-upload-input`
- `company-main-save-btn`
- `company-about-editor`, `company-about-save-btn`
- `banner-add-btn`, `company-content-save-btn`
- `banner-{i}-title-input`, `banner-{i}-subtitle-input`
- `banner-{i}-image-alt-input`, `banner-{i}-bg-image-alt-input`
- `banner-{i}-image-upload-btn`, `banner-{i}-image-upload-input`
- `banner-{i}-bgImage-upload-btn`, `banner-{i}-bgImage-upload-input`
- `banner-{i}-delete-btn`

### Snackbar (global)

- `snackbar-alert` — `data-severity`: `success | error | warning | info`
