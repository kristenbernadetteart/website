import { Link } from "react-router-dom";
import { tinaField } from "tinacms/dist/react";
import type { Site } from "../lib/site";
import type { Painting } from "../lib/paintings";
import { formatPrice, paintingMeta } from "../lib/format";
import StatusBadge from "./StatusBadge";

export default function Hero({
  site,
  painting,
}: {
  site: Site;
  painting?: Painting;
}) {
  return (
    <section className="container hero">
      <div className="hero__copy">
        <h1 data-tina-field={tinaField(site, "tagline")}>{site.tagline}</h1>
        {site.intro && (
          <p className="hero__intro" data-tina-field={tinaField(site, "intro")}>
            {site.intro}
          </p>
        )}
        <div className="hero__actions">
          <a className="btn btn--primary" href="#work">
            View the work
          </a>
          <Link className="btn btn--secondary" to="/about">
            About the artist
          </Link>
        </div>
      </div>

      {painting?.image && (
        <Link
          className="hero__feature"
          to={`/work/${painting._sys.filename}`}
          aria-label={`${painting.title}, view details`}
        >
          <div className="mat">
            <img
              src={painting.image}
              alt={painting.imageAlt || painting.title}
              data-tina-field={tinaField(painting, "image")}
            />
          </div>
          <div className="hero__caption">
            <div>
              <p className="hero__caption-title">{painting.title}</p>
              <p className="muted">{paintingMeta(painting)}</p>
            </div>
            <div className="hero__caption-side">
              <span className="price">{formatPrice(painting.price)}</span>
              <StatusBadge status={painting.status} />
            </div>
          </div>
        </Link>
      )}
    </section>
  );
}
