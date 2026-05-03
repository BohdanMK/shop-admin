# Orders — Filter

## OrdersFilter drawer

**File:** `src/components/orders/OrdersFilter.tsx`

| data-testid                   | Type       | Description             |
| ----------------------------- | ---------- | ----------------------- |
| `orders-filter-open-btn`      | button     | Open filter drawer      |
| `orders-filter-name-input`    | text input | Search by customer name |
| `orders-filter-status-select` | select     | Filter by status        |
| `orders-filter-reset-btn`     | button     | Reset all filters       |
| `orders-filter-apply-btn`     | button     | Apply filters           |

### Status select values

| value        | Label      |
| ------------ | ---------- |
| `` (empty)   | All        |
| `pending`    | Pending    |
| `confirmed`  | Confirmed  |
| `processing` | Processing |

## Playwright example

```ts
await page.getByTestId("orders-filter-open-btn").click();
await page.getByTestId("orders-filter-name-input").fill("John");
await page.getByTestId("orders-filter-status-select").selectOption("pending");
await page.getByTestId("orders-filter-apply-btn").click();

// Reset
await page.getByTestId("orders-filter-open-btn").click();
await page.getByTestId("orders-filter-reset-btn").click();
```
