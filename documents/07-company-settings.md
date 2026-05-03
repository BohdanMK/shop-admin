# Company Settings — Main / About / Content

## MainSetting (company info)

**File:** `src/components/settingsCompany/MainSetting.tsx`

| data-testid                 | Type              | Description           |
| --------------------------- | ----------------- | --------------------- |
| `company-title-input`       | text input        | Company name          |
| `company-logo-alt-input`    | text input        | Logo alt text         |
| `company-logo-upload-btn`   | button            | Pick logo file        |
| `company-logo-upload-input` | hidden file input | `<input type="file">` |
| `company-main-save-btn`     | button            | Save company info     |

**Logo upload media:** `src/components/settingsCompany/settingForm/LogoFormMedia.tsx`

---

## AboutAsSettings (about page)

**File:** `src/components/settingsCompany/AboutAsSettings.tsx`

| data-testid              | Type             | Description                           |
| ------------------------ | ---------------- | ------------------------------------- |
| `company-about-editor`   | rich-text editor | About us description (Tiptap / Quill) |
| `company-about-save-btn` | button           | Save about page                       |

---

## ContentSetting (banner slides)

**File:** `src/components/settingsCompany/ContentSetting.tsx`

### Top-level buttons

| data-testid                | Description             |
| -------------------------- | ----------------------- |
| `banner-add-btn`           | Add new banner slide    |
| `company-content-save-btn` | Save all banner content |

### Per-banner fields (index = 0, 1, 2…)

| data-testid                           | Type              | Description                          |
| ------------------------------------- | ----------------- | ------------------------------------ |
| `banner-{index}-title-input`          | text input        | Banner title                         |
| `banner-{index}-subtitle-input`       | text input        | Banner subtitle                      |
| `banner-{index}-image-alt-input`      | text input        | Main image alt text                  |
| `banner-{index}-bg-image-alt-input`   | text input        | Background image alt text            |
| `banner-{index}-image-upload-btn`     | button            | Pick main image                      |
| `banner-{index}-image-upload-input`   | hidden file input | `<input type="file">` for main image |
| `banner-{index}-bgImage-upload-btn`   | button            | Pick background image                |
| `banner-{index}-bgImage-upload-input` | hidden file input | `<input type="file">` for bg image   |
| `banner-{index}-delete-btn`           | icon button       | Remove this banner slide             |

**Banner image media:** `src/components/settingsCompany/settingForm/BannerContentImageMedia.tsx`

---

## Snackbar

| data-testid      | data-severity | Description    |
| ---------------- | ------------- | -------------- |
| `snackbar-alert` | `success`     | Settings saved |
| `snackbar-alert` | `error`       | Save error     |

## Playwright example

```ts
// Edit company name
await page.getByTestId("company-title-input").fill("My Shop");
await page.getByTestId("company-main-save-btn").click();
await page.getByTestId("snackbar-alert").waitFor();

// Add banner
await page.getByTestId("banner-add-btn").click();
await page.getByTestId("banner-0-title-input").fill("Big Sale");
await page
  .getByTestId("banner-0-subtitle-input")
  .fill("Up to 50% off everything");
await page.getByTestId("company-content-save-btn").click();

// Delete first banner
await page.getByTestId("banner-0-delete-btn").click();
```
