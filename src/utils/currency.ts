// utils/currency.ts
const CURRENCY_LABELS: Record<string, string> = {
    UAH: 'грн',
    USD: '$',
    EUR: '€',
}

export function formatCurrency(amount: number, currency: string): string {
    const label = CURRENCY_LABELS[currency] ?? currency
    return `${amount} ${label}`
}