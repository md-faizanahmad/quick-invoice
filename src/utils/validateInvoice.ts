import type { Invoice } from "../types/invoice";
import type { ValidationErrors } from "../types/validation";

/* ---------- REGEX RULES ---------- */

// Seller / Customer name
// Letters, space, dot, hyphen — no numbers, no symbols
const NAME_REGEX = /^[A-Za-z][A-Za-z .-]{1,48}$/;

// Item name: letters + numbers allowed
const ITEM_NAME_REGEX = /^[A-Za-z0-9][A-Za-z0-9 .-]{1,58}$/;

// GST / VAT ID (generic alphanumeric, no symbols)
const TAX_ID_REGEX = /^[0-9A-Z]{15}$/;

export function validateInvoice(invoice: Invoice): ValidationErrors {
  const errors: ValidationErrors = {};

  /* ---------- SELLER ---------- */
  if (!invoice.seller.name.trim()) {
    errors["seller.name"] = "Seller name is required";
  } else if (!NAME_REGEX.test(invoice.seller.name)) {
    errors["seller.name"] =
      "Only letters, spaces, dot (.) and hyphen (-) allowed";
  }

  if (!invoice.seller.address.trim()) {
    errors["seller.address"] = "Seller address is required";
  }

  if (invoice.tax.mode !== "NONE") {
    if (!invoice.seller.taxId?.trim()) {
      errors["seller.taxId"] = `${invoice.tax.label} ID is required`;
    } else if (!TAX_ID_REGEX.test(invoice.seller.taxId)) {
      errors[
        "seller.taxId"
      ] = `${invoice.tax.label} ID must be 15 letters/numbers`;
    }
  }

  /* ---------- CUSTOMER ---------- */
  if (!invoice.customer.name.trim()) {
    errors["customer.name"] = "Customer name is required";
  } else if (!NAME_REGEX.test(invoice.customer.name)) {
    errors["customer.name"] = "Invalid customer name format";
  }

  if (!invoice.customer.address.trim()) {
    errors["customer.address"] = "Customer address is required";
  }

  // Customer taxId remains optional (correct)

  /* ---------- ITEMS ---------- */
  if (invoice.items.length === 0) {
    errors["items"] = "At least one item is required";
  }

  invoice.items.forEach((item, index) => {
    /* Item name */
    if (!item.name.trim()) {
      errors[`items.${index}.name`] = "Item name is required";
    } else if (!ITEM_NAME_REGEX.test(item.name)) {
      errors[`items.${index}.name`] =
        "Item name can contain letters and numbers only";
    }

    /* Quantity: integer 1–10,000 */
    if (!Number.isInteger(item.qty)) {
      errors[`items.${index}.qty`] = "Quantity must be a whole number";
    } else if (item.qty < 1 || item.qty > 10_000) {
      errors[`items.${index}.qty`] = "Quantity must be between 1 and 10,000";
    }

    /* Price: 0–10,000,000 */
    if (item.price < 0) {
      errors[`items.${index}.price`] = "Price cannot be negative";
    } else if (item.price > 10_000_000) {
      errors[`items.${index}.price`] = "Price cannot exceed 10,000,000";
    }
  });

  /* ---------- TOTALS ---------- */
  if (invoice.totals.total <= 0) {
    errors["totals.total"] = "Invoice total must be greater than 0";
  }

  return errors;
}
