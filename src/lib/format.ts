export const formatPrice = (n: number | string | null | undefined) => {
  if (n == null) return "";
  const v = typeof n === "string" ? parseFloat(n) : n;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: v % 1 === 0 ? 0 : 2,
  }).format(v);
};

export const cn = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");
