export const ORDER_STATUSES = ['pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'] as const;
export const RFQ_STATUSES = ['new', 'contacted', 'quoted', 'in_procurement', 'completed', 'cancelled'] as const;
export const SOURCING_STATUSES = ['reviewing', 'contacted', 'quoted', 'in_procurement', 'shipped', 'completed', 'cancelled'] as const;
export const DELIVERY_CHARGES = { dhaka: 70, suburb: 100, outside: 130 } as const;
export const PAYMENT_METHODS = ['cod', 'bkash', 'nagad'] as const;
export const validId = (value: unknown) => Number.isSafeInteger(Number(value)) && Number(value) > 0;
export function cleanPhone(value: unknown) {
  return typeof value === 'string' ? value.replace(/[\s\-()]/g, '') : '';
}
export function validPhone(value: unknown) {
  return /^\+?\d{7,15}$/.test(cleanPhone(value));
}
export function validText(value: unknown, max = 2000, required = false) {
  return typeof value === 'string' && value.length <= max && (!required || !!value.trim());
}
