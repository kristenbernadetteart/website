import {
  Link,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { tinaField, useTina } from "tinacms/dist/react";
import client from "../../tina/__generated__/client";
import { formatPrice } from "../lib/format";
import { lowestPrice, printSizes } from "../lib/prints";
import { useSite } from "../lib/site";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const result = await client.queries.print({
    relativePath: `${params.slug}.md`,
  });
  // Hidden prints 404 for visitors, but still preview inside the Tina editor,
  // which renders the site in an iframe.
  if (result.data.print.status === "hidden" && window.self === window.top) {
    throw new Response("Not found", { status: 404 });
  }
  return result;
};

export default function Print() {
  const { data } = useTina(
    useLoaderData() as Awaited<ReturnType<typeof loader>>,
  );
  const site = useSite();
  const p = data.print;

  useDocumentTitle(p.title, site.artistName);

  const sizes = printSizes(p);
  const from = lowestPrice(p);
  const original = p.painting;

  const details: Array<[string, string | null | undefined]> = [
    ["Print type", p.printType],
    ["Edition", p.edition],
  ];

  return (
    <article className="container work">
      <Link className="back-link" to="/prints">
        Back to all prints
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
            {original && (
              <div className="specs__row">
                <dt>Original</dt>
                <dd data-tina-field={tinaField(p, "painting")}>
                  <Link to={`/work/${original._sys.filename}`}>
                    {original.title}
                  </Link>
                </dd>
              </div>
            )}
          </dl>

          {sizes.length > 0 && (
            <section className="prints" aria-labelledby="sizes-heading">
              <h2 id="sizes-heading" className="prints__heading">
                Sizes
              </h2>
              <ul className="prints__list" data-tina-field={tinaField(p, "sizes")}>
                {sizes.map((s, i) => (
                  <li key={i} className="prints__item">
                    <span className="prints__name">{s.size}</span>
                    <span className="price">{formatPrice(s.price)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="work__buy">
            {from !== null && (
              <span className="price price--lg">
                {sizes.length > 1 ? `From ${formatPrice(from)}` : formatPrice(from)}
              </span>
            )}
          </div>

          {p.shopUrl && (
            <div className="work__actions">
              <a
                className="btn btn--primary"
                href={p.shopUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-tina-field={tinaField(p, "shopUrl")}
              >
                Buy this print
              </a>
            </div>
          )}

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
