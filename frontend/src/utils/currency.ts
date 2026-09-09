export const formatCurrency = (amount: number | string | undefined | null): string => {
  // Coerce any non-numeric value to 0, ensuring we always handle a valid number.
  // This explicitly prevents string concatenation issues (e.g. "450" + "1180" -> "4501180")
  const num = Number(amount) || 0;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0 // Typically e-commerce sites show whole rupees unless there are paisa
  }).format(num);
};
