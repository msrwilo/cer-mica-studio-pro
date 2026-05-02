export const fmtMoney = (n: number | null | undefined) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 2 }).format(Number(n ?? 0));

export const fmtNum = (n: number | null | undefined, d = 2) =>
  new Intl.NumberFormat("es-MX", { maximumFractionDigits: d }).format(Number(n ?? 0));

export const fmtDate = (d: string | Date | null | undefined) => {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(date);
};

export const fmtDateTime = (d: string | Date | null | undefined) => {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "short", timeStyle: "short" }).format(date);
};
