const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const formatPrice = (price?: number | null) =>
  typeof price === "number" ? usd.format(price) : null;

export const statusLabel = (status?: string | null) => {
  switch (status) {
    case "sold":
      return "Sold";
    case "reserved":
      return "Reserved";
    default:
      return "Available";
  }
};

export const paintingMeta = (p: {
  year?: number | null;
  medium?: string | null;
}) => [p.year, p.medium].filter(Boolean).join(", ");
