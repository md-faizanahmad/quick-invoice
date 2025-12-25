import type { Currency } from "../types/invoice";

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
  }).format(amount);
}
