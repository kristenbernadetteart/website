import { statusLabel } from "../lib/format";

export default function StatusBadge({ status }: { status?: string | null }) {
  const key = status === "sold" || status === "reserved" ? status : "available";
  return <span className={`badge badge--${key}`}>{statusLabel(key)}</span>;
}
