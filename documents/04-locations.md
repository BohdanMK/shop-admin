# Locations — Create / Edit

## LocationForm wrapper

**File:** `src/components/locations/LocationForm.tsx`

| data-testid           | Description   |
| --------------------- | ------------- |
| `location-submit-btn` | Save location |

---

## LocationFormMain

**File:** `src/components/locations/locationForm/LocationFormMain.tsx`

| data-testid                  | Type       | Description              |
| ---------------------------- | ---------- | ------------------------ |
| `location-name-input`        | text input | Location name            |
| `location-address-input`     | text input | Address                  |
| `location-description-input` | textarea   | Description              |
| `location-schedule-input`    | text input | Working hours / schedule |
| `location-type-select`       | select     | Location type            |

---

## LocationFormMedia

**File:** `src/components/locations/locationForm/LocationFormMedia.tsx`

| data-testid                   | Type              | Description           |
| ----------------------------- | ----------------- | --------------------- |
| `location-image-alt-input`    | text input        | Image alt text        |
| `location-image-upload-btn`   | button            | Pick image file       |
| `location-image-upload-input` | hidden file input | `<input type="file">` |

---

## LocationFormMap

**File:** `src/components/locations/locationForm/LocationFormMap.tsx`

| data-testid          | Type         | Description |
| -------------------- | ------------ | ----------- |
| `location-lat-input` | number input | Latitude    |
| `location-lng-input` | number input | Longitude   |

---

## LocationFormContactsPhone (dynamic list)

**File:** `src/components/locations/locationForm/LocationFormContactsPhone.tsx`

| data-testid                         | Type        | Description                     |
| ----------------------------------- | ----------- | ------------------------------- |
| `location-phone-{index}-input`      | text input  | Phone number (index = 0, 1, 2…) |
| `location-phone-{index}-delete-btn` | icon button | Remove this phone number        |
| `location-add-phone-btn`            | button      | Add new phone number            |

---

## Snackbar

| data-testid      | data-severity | Description    |
| ---------------- | ------------- | -------------- |
| `snackbar-alert` | `success`     | Location saved |
| `snackbar-alert` | `error`       | Save error     |

## Playwright example

```ts
await page.getByTestId("location-name-input").fill("Main Office");
await page.getByTestId("location-address-input").fill("Khreshchatyk St 1");
await page.getByTestId("location-lat-input").fill("50.450001");
await page.getByTestId("location-lng-input").fill("30.523333");

// Add phones
await page.getByTestId("location-add-phone-btn").click();
await page.getByTestId("location-phone-0-input").fill("+380501234567");

await page.getByTestId("location-submit-btn").click();
await page.getByTestId("snackbar-alert").waitFor();
```
