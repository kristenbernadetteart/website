import {
  Link,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { tinaField, useTina } from "tinacms/dist/react";
import client from "../../tina/__generated__/client";
import StatusBadge from "../components/StatusBadge";
import { formatPrice } from "../lib/format";
import { useSite } from "../lib/site";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export const loader = ({ params }: LoaderFunctionArgs) =>
  client.queries.painting({ relativePath: `${params.slug}.md` });

export default function Painting() {
  const { data } = useTina(
    useLoaderData() as Awaited<ReturnType<typeof loader>>,
  );
  const site = useSite();
  const p = data.painting;

  useDocumentTitle(p.title, site.artistName);

  const status = p.status ?? "available";
  const subject = encodeURIComponent(`Inquiry: ${p.title}`);
  const body = encodeURIComponent(
    `Hello,\n\nI'm interested in "${p.title}"${p.year ? ` (${p.year})` : ""}.\n\n`,
  );
  const mailto = `mailto:${site.contactEmail}?subject=${subject}&body=${body}`;

  const details: Array<[string, string | number | null | undefined]> = [
    ["Year", p.year],
    ["Medium", p.medium],
    ["Size", p.dimensions],
  ];

  return (
    <article className="container work">
      <Link className="back-link" to="/">
        Back to all work
      </Link>

      <div className="work__grid">
        <div className="mat mat--tall work__image">
          {p.image && (
            <img
              src={p.image}
              alt={p.imageAlt || p.title}
              data-tina-field={tinaField(p, "image")}
            />
          )}
        </div>

        <div className="work__info">
          <h1 data-tina-field={tinaField(p, "title")}>{p.title}</h1>

          <dl className="specs">
            {details
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label} className="specs__row">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
          </dl>

          <div className="work__buy">
            <span
              className="price price--lg"
              data-tina-field={tinaField(p, "price")}
            >
              {status === "sold" ? "Sold" : formatPrice(p.price)}
            </span>
            <StatusBadge status={status} />
          </div>

          <div className="work__actions">
            {status === "available" && p.buyUrl && (
              <a
                className="btn btn--primary"
                href={p.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Buy now
              </a>
            )}
            {status === "available" && (
              <a
                className={`btn ${p.buyUrl ? "btn--secondary" : "btn--primary"}`}
                href={mailto}
              >
                Inquire about this painting
              </a>
            )}
            {status === "reserved" && (
              <a className="btn btn--secondary" href={mailto}>
                Ask about availability
              </a>
            )}
            {status === "sold" && (
              <a className="btn btn--secondary" href={mailto}>
                Ask about similar work
              </a>
            )}
          </div>

          {p.body && (
            <div className="prose" data-tina-field={tinaField(p, "body")}>
              <TinaMarkdown content={p.body} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
