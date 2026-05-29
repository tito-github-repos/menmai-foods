export const MIN_BULK_QTY = 200;
 
/* ─── Types ─────────────────────────────────────────────────────────────── */
 
export interface BulkOrderFormValues {
  name: string;
  phone: string;
  email: string;
  deliveryDate: string;
  occasion: string;
  address: string;
}
 
export interface ProductRowForValidation {
  name: string;
  qty: string; // raw string from the controlled input
}
 
export interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  deliveryDate?: string;
  occasion?: string;
  address?: string;
  products?: string;          // top-level "no products selected" error
  qty?: Record<string, string>; // per-product qty errors  { [productName]: message }
}
 
/* ─── Individual field validators ───────────────────────────────────────── */
 
/** Name: required, at least 2 chars, letters/spaces/dots/hyphens only */
export function validateName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Name is required.";
  if (trimmed.length < 2) return "Name must be at least 2 characters.";
  if (!/^[a-zA-Z\s.\-']+$/.test(trimmed))
    return "Name can only contain letters, spaces, dots, or hyphens.";
  return undefined;
}
 
/** Phone: required, exactly 10 digits, optionally prefixed with +91 or 0 */
export function validatePhone(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Phone number is required.";
  // Strip +91 or leading 0
  const digits = trimmed.replace(/^(\+91|0)/, "").replace(/\s+/g, "");
  if (!/^\d{10}$/.test(digits))
    return "Enter a valid 10-digit Indian mobile number.";
  // First digit after country code must be 6-9
  if (!/^[6-9]/.test(digits))
    return "Mobile number must start with 6, 7, 8, or 9.";
  return undefined;
}
 
/** Email: required, standard RFC-ish pattern */
export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed))
    return "Enter a valid email address.";
  return undefined;
}
 
/** Delivery date: required, must not be in the past, allow at least today */
export function validateDeliveryDate(value: string): string | undefined {
  if (!value) return "Delivery date is required.";
  const selected = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (isNaN(selected.getTime())) return "Enter a valid date.";
  if (selected < today) return "Delivery date cannot be in the past.";
  return undefined;
}
 
/** Occasion: required, minimum 5 characters */
export function validateOccasion(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Occasion / event details are required.";
  if (trimmed.length < 5)
    return "Please provide a bit more detail about the occasion.";
  return undefined;
}
 
/** Address: required, minimum 10 characters */
export function validateAddress(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Delivery address is required.";
  if (trimmed.length < 10)
    return "Please enter a complete delivery address (at least 10 characters).";
  return undefined;
}
 
/* ─── Product / quantity validators ─────────────────────────────────────── */
 
/** At least one product must be selected */
export function validateProductsSelected(
  productRows: ProductRowForValidation[]
): string | undefined {
  if (productRows.length === 0)
    return "Please select at least one product before submitting.";
  return undefined;
}
 
/**
 * Per-product quantity validation.
 * Returns a map of { productName → errorMessage } for every row that fails.
 * Returns an empty object if all rows are valid.
 */
export function validateProductQuantities(
  productRows: ProductRowForValidation[]
): Record<string, string> {
  const errors: Record<string, string> = {};
 
  productRows.forEach((row) => {
    const raw = row.qty.trim();
 
    if (!raw) {
      errors[row.name] = `Quantity is required (min ${MIN_BULK_QTY} pieces).`;
      return;
    }
 
    const num = Number(raw);
 
    if (!Number.isInteger(num) || isNaN(num)) {
      errors[row.name] = "Quantity must be a whole number.";
      return;
    }
 
    if (num <= 0) {
      errors[row.name] = "Quantity must be greater than 0.";
      return;
    }
 
    if (num < MIN_BULK_QTY) {
      errors[row.name] = `Minimum ${MIN_BULK_QTY} pieces required for bulk orders.`;
      return;
    }
  });
 
  return errors;
}
 
/* ─── Full-form validator ────────────────────────────────────────────────── */
 
/**
 * Validates the entire form in one shot.
 *
 * @returns `{ errors, isValid }`
 *   - `errors` — partial FormErrors object (only failing fields populated)
 *   - `isValid` — true when errors is completely empty
 */
export function validateBulkOrderForm(
  form: BulkOrderFormValues,
  productRows: ProductRowForValidation[]
): { errors: FormErrors; isValid: boolean } {
  const errors: FormErrors = {};
 
  // Contact fields
  const nameErr = validateName(form.name);
  if (nameErr) errors.name = nameErr;
 
  const phoneErr = validatePhone(form.phone);
  if (phoneErr) errors.phone = phoneErr;
 
  const emailErr = validateEmail(form.email);
  if (emailErr) errors.email = emailErr;
 
  const dateErr = validateDeliveryDate(form.deliveryDate);
  if (dateErr) errors.deliveryDate = dateErr;
 
  const occasionErr = validateOccasion(form.occasion);
  if (occasionErr) errors.occasion = occasionErr;
 
  const addressErr = validateAddress(form.address);
  if (addressErr) errors.address = addressErr;
 
  // Products
  const productsErr = validateProductsSelected(productRows);
  if (productsErr) errors.products = productsErr;
 
  // Per-product quantities (only run if products are selected)
  if (productRows.length > 0) {
    const qtyErrors = validateProductQuantities(productRows);
    if (Object.keys(qtyErrors).length > 0) {
      errors.qty = qtyErrors;
    }
  }
 
  const isValid = Object.keys(errors).length === 0;
  return { errors, isValid };
}
 
/* ─── Real-time (on-blur / on-change) single-field helper ───────────────── */
 
/**
 * Validate a single named field on the fly (for inline feedback while typing).
 * Pass the current form values and get back just that field's error (or undefined).
 */
export function validateField(
  field: keyof BulkOrderFormValues,
  value: string
): string | undefined {
  switch (field) {
    case "name":         return validateName(value);
    case "phone":        return validatePhone(value);
    case "email":        return validateEmail(value);
    case "deliveryDate": return validateDeliveryDate(value);
    case "occasion":     return validateOccasion(value);
    case "address":      return validateAddress(value);
    default:             return undefined;
  }
}
 