// Seed and server prices use USD. Convert once at the display boundary.
export function rupeeCents(price: number): number {
  return Math.round(Number(price) * 91 * 100)
}
export function formatRupees(cents: number): string {
  return `₹${(cents / 100).toFixed(2)}`
}
export function cartTotals(items: { product: { price: number }; quantity: number }[]) {
  const subtotal = items.reduce((sum, item) => sum + rupeeCents(item.product.price) * item.quantity, 0)
  const tax = Math.round(subtotal * 0.08)
  return { subtotal, tax, total: subtotal + tax }
}
