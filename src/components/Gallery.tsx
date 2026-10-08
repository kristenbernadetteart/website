import { useState } from "react";
import { STATUSES, type Painting } from "../lib/paintings";
import { statusLabel } from "../lib/format";
import PaintingCard from "./PaintingCard";

type Filter = "all" | (typeof STATUSES)[number];

export default function Gallery({ paintings }: { paintings: Painting[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const count = (s: Filter) =>
    s === "all"
      ? paintings.length
      : paintings.filter((p) => (p.status ?? "available") === s).length;

  const filters: Filter[] = [
    "all",
    ...STATUSES.filter((s) => count(s) > 0),
  ];

  const visible =
    filter === "all"
      ? paintings
      : paintings.filter((p) => (p.status ?? "available") === filter);

  return (
    <section id="work" className="container section" aria-labelledby="work-title">
      <div className="section__head">
        <h2 id="work-title">Work</h2>
        <div className="chips" role="group" aria-label="Filter paintings">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className="chip"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : statusLabel(f)}
              <span className="chip__count">{count(f)}</span>
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="muted">No paintings here yet.</p>
      ) : (
        <ul className="grid">
          {visible.map((p) => (
            <li key={p.id}>
              <PaintingCard painting={p} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
