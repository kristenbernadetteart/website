import type client from "../../tina/__generated__/client";

type ConnectionResult = Awaited<
  ReturnType<typeof client.queries.printConnection>
>;
type Edge = NonNullable<
  NonNullable<ConnectionResult["data"]["printConnection"]["edges"]>[number]
>;

export type Print = NonNullable<Edge["node"]>;

/** Flatten a printConnection result into a list, by sort order then title. */
export function toPrints(data: ConnectionResult["data"]): Print[] {
  const edges = data.printConnection.edges ?? [];
  return edges
    .flatMap((edge) => (edge?.node ? [edge.node] : []))
    .sort(
      (a, b) =>
        (a.order ?? Infinity) - (b.order ?? Infinity) ||
        a.title.localeCompare(b.title),
    );
}

/** Prints the editor hasn't hidden. */
export const visiblePrints = (prints: Print[]) =>
  prints.filter((p) => p.status !== "hidden");

/** Size options that have both a size and a price filled in. */
export const printSizes = (p: { sizes?: Print["sizes"] }) =>
  (p.sizes ?? []).flatMap((s) =>
    s?.size && typeof s.price === "number"
      ? [{ ...s, size: s.size, price: s.price }]
      : [],
  );

/** Lowest price across a print's sizes, if any are priced. */
export const lowestPrice = (p: { sizes?: Print["sizes"] }) => {
  const prices = printSizes(p).map((s) => s.price);
  return prices.length ? Math.min(...prices) : null;
};

/** Prints whose "Original painting" points at the given painting document. */
export const printsOf = (prints: Print[], paintingId: string) =>
  prints.filter((p) => p.painting?.id === paintingId);
