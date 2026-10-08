import type client from "../../tina/__generated__/client";

type ConnectionResult = Awaited<
  ReturnType<typeof client.queries.paintingConnection>
>;
type Edge = NonNullable<
  NonNullable<ConnectionResult["data"]["paintingConnection"]["edges"]>[number]
>;

export type Painting = NonNullable<Edge["node"]>;

export const STATUSES = ["available", "reserved", "sold"] as const;
export type Status = (typeof STATUSES)[number];

/** Flatten a paintingConnection result into a list, newest year first. */
export function toPaintings(data: ConnectionResult["data"]): Painting[] {
  const edges = data.paintingConnection.edges ?? [];
  return edges
    .flatMap((edge) => (edge?.node ? [edge.node] : []))
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}
