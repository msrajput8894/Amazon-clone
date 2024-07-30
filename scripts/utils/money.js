
// formats the currency converts into dollar
export function formatCurrency(priceCents) {
  return (Math.round(priceCents) / 100).toFixed(2);
}
