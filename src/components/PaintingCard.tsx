import { Link } from "react-router-dom";
import { tinaField } from "tinacms/dist/react";
import type { Painting } from "../lib/paintings";
import { formatPrice, paintingMeta } from "../lib/format";
import StatusBadge from "./StatusBadge";

export default function PaintingCard({ painting }: { painting: Painting }) {
  return (
    <Link className="card" to={`/work/${painting._sys.filename}`}>
      <div className="mat">
        {painting.image && (
          <img
            src={painting.image}
            alt={painting.imageAlt || painting.title}
            loading="lazy"
          />
        )}
      </div>
      <div className="card__body">
        <h3
          className="card__title"
          data-tina-field={tinaField(painting, "title")}
        >
          {painting.title}
        </h3>
        <p className="muted">{paintingMeta(painting)}</p>
        <div className="card__foot">
          <span className="price">{formatPrice(painting.price)}</span>
          <StatusBadge status={painting.status} />
        </div>
      </div>
    </Link>
  );
}
