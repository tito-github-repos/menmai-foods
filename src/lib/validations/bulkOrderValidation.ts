export const MIN_BULK_QTY = 200;

const WORK_START_HOUR = 9;
const WORK_END_HOUR = 19;

export interface BulkOrderFormValues {
  name: string;
  phone: string;
  email: string;
  deliveryDate: string;
  deliveryTime: string;
  occasion: string;
  address: string;
  pincode: string;
}

export interface ProductRowForValidation {
  name: string;
  qty: string;
}

export interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  occasion?: string;
  address?: string;
  pincode?: string;
  products?: string;
  qty?: Record<string, string>;
}

const ALLOWED_MADURAI_PINCODES = [
  "625001", "625002", "625003", "625004", "625005",
  "625006", "625007", "625008", "625009", "625010",
  "625011", "625012", "625014", "625016", "625017",
  "625018", "625020",
];

function parseDateInput(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isSundayDate(date: Date): boolean {
  return date.getDay() === 0;
}

function getNextWorkingStart(from: Date): Date {
  const next = new Date(from);

  if (isSundayDate(next)) {
    next.setDate(next.getDate() + 1);
    next.setHours(WORK_START_HOUR, 0, 0, 0);
    return next;
  }

  if (next.getHours() < WORK_START_HOUR) {
    next.setHours(WORK_START_HOUR, 0, 0, 0);
    return next;
  }

  if (next.getHours() >= WORK_END_HOUR) {
    next.setDate(next.getDate() + 1);
    next.setHours(WORK_START_HOUR, 0, 0, 0);

    if (isSundayDate(next)) {
      next.setDate(next.getDate() + 1);
    }

    return next;
  }

  return next;
}

function addWorkingHours(start: Date, hoursToAdd: number): Date {
  let current = getNextWorkingStart(start);
  let remaining = hoursToAdd;

  while (remaining > 0) {
    if (isSundayDate(current)) {
      current.setDate(current.getDate() + 1);
      current.setHours(WORK_START_HOUR, 0, 0, 0);
      continue;
    }

    const workEnd = new Date(current);
    workEnd.setHours(WORK_END_HOUR, 0, 0, 0);

    const availableToday =
      (workEnd.getTime() - current.getTime()) / (1000 * 60 * 60);

    if (remaining <= availableToday) {
      current.setHours(current.getHours() + remaining);
      return current;
    }

    remaining -= availableToday;
    current.setDate(current.getDate() + 1);
    current.setHours(WORK_START_HOUR, 0, 0, 0);
  }

  return current;
}

export function validateName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Name is required.";
  if (trimmed.length < 2) return "Name must be at least 2 characters.";
  if (!/^[a-zA-Z\s.\-']+$/.test(trimmed)) {
    return "Name can only contain letters, spaces, dots, or hyphens.";
  }
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Phone number is required.";

  const digits = trimmed.replace(/^(\+91|0)/, "").replace(/\s+/g, "");
  if (!/^\d{10}$/.test(digits)) return "Enter a valid 10-digit Indian mobile number.";
  if (!/^[6-9]/.test(digits)) return "Mobile number must start with 6, 7, 8, or 9.";

  return undefined;
}

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email address.";
  return undefined;
}

export function validateDeliveryDate(value: string): string | undefined {
  if (!value) return "Delivery date is required.";

  const selected = parseDateInput(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(selected.getTime())) return "Enter a valid date.";
  if (selected < today) return "Delivery date cannot be in the past.";
  if (isSundayDate(selected)) return "Delivery is not available on Sunday.";

  return undefined;
}

export function validateDeliveryTime(value: string): string | undefined {
  if (!value) return "Delivery time slot is required.";
  return undefined;
}

export function validateOccasion(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Occasion / event details are required.";
  if (trimmed.length < 5) return "Please provide a bit more detail about the occasion.";
  return undefined;
}

export function validateAddress(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Delivery address is required.";
  if (trimmed.length < 10) return "Please enter a complete delivery address.";
  return undefined;
}

export function validatePincode(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) return "Pincode is required.";
  if (!/^\d{6}$/.test(trimmed)) return "Enter a valid 6-digit pincode.";
  if (!ALLOWED_MADURAI_PINCODES.includes(trimmed)) {
    return "Delivery is available only within our Madurai delivery zone.";
  }

  return undefined;
}

export function getLeadTimeHours(totalPieces: number): number {
  if (totalPieces <= 500) return 6;
  if (totalPieces <= 1000) return 12;
  if (totalPieces <= 2000) return 24;
  return 48;
}

function formatHour(hour: number): string {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getAvailableTimeSlots(
  deliveryDate: string,
  totalPieces: number
): string[] {
  if (!deliveryDate || totalPieces <= 0) return [];

  const selectedDate = parseDateInput(deliveryDate);
  if (isSundayDate(selectedDate)) return [];

  const leadTimeHours = getLeadTimeHours(totalPieces);
  const earliestDeliveryTime = addWorkingHours(new Date(), leadTimeHours);

  const slots: string[] = [];

  for (let hour = WORK_START_HOUR; hour < WORK_END_HOUR; hour++) {
    const slotStart = parseDateInput(deliveryDate);
    slotStart.setHours(hour, 0, 0, 0);

    if (slotStart >= earliestDeliveryTime) {
      slots.push(`${formatHour(hour)} - ${formatHour(hour + 1)}`);
    }
  }

  return slots;
}

export function validateProductsSelected(
  productRows: ProductRowForValidation[]
): string | undefined {
  if (productRows.length === 0) return "Please select at least one product before submitting.";
  return undefined;
}

export function validateProductQuantities(
  productRows: ProductRowForValidation[]
): Record<string, string> {
  const errors: Record<string, string> = {};

  productRows.forEach((row) => {
    const raw = row.qty.trim();
    const num = Number(raw);

    if (!raw) {
      errors[row.name] = `Quantity is required (min ${MIN_BULK_QTY} pieces).`;
    } else if (!Number.isInteger(num) || isNaN(num)) {
      errors[row.name] = "Quantity must be a whole number.";
    } else if (num <= 0) {
      errors[row.name] = "Quantity must be greater than 0.";
    } else if (num < MIN_BULK_QTY) {
      errors[row.name] = `Minimum ${MIN_BULK_QTY} pieces required for bulk orders.`;
    }
  });

  return errors;
}

export function validateBulkOrderForm(
  form: BulkOrderFormValues,
  productRows: ProductRowForValidation[]
): { errors: FormErrors; isValid: boolean } {
  const errors: FormErrors = {};

  const totalPieces = productRows.reduce((sum, row) => sum + (Number(row.qty) || 0), 0);

  errors.name = validateName(form.name);
  errors.phone = validatePhone(form.phone);
  errors.email = validateEmail(form.email);
  errors.deliveryDate = validateDeliveryDate(form.deliveryDate);
  errors.deliveryTime = validateDeliveryTime(form.deliveryTime);
  errors.occasion = validateOccasion(form.occasion);
  errors.address = validateAddress(form.address);
  errors.pincode = validatePincode(form.pincode);

  const availableSlots = getAvailableTimeSlots(form.deliveryDate, totalPieces);
  if (form.deliveryTime && !availableSlots.includes(form.deliveryTime)) {
    errors.deliveryTime = "Selected delivery time is not available for this quantity.";
  }

  const productsErr = validateProductsSelected(productRows);
  if (productsErr) errors.products = productsErr;

  const qtyErrors = validateProductQuantities(productRows);
  if (Object.keys(qtyErrors).length > 0) errors.qty = qtyErrors;

  Object.keys(errors).forEach((key) => {
    if (errors[key as keyof FormErrors] === undefined) {
      delete errors[key as keyof FormErrors];
    }
  });

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

export function validateField(
  field: keyof BulkOrderFormValues,
  value: string
): string | undefined {
  switch (field) {
    case "name": return validateName(value);
    case "phone": return validatePhone(value);
    case "email": return validateEmail(value);
    case "deliveryDate": return validateDeliveryDate(value);
    case "deliveryTime": return validateDeliveryTime(value);
    case "occasion": return validateOccasion(value);
    case "address": return validateAddress(value);
    case "pincode": return validatePincode(value);
    default: return undefined;
  }
}