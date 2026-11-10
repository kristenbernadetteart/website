import { useLoaderData } from "react-router-dom";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { tinaField, useTina } from "tinacms/dist/react";
import client from "../../tina/__generated__/client";
import PrintCard from "../components/PrintCard";
import { toPrints, visiblePrints } from "../lib/prints";
import { useSite } from "../lib/site";
import { useDocumentTitle } from "../lib/useDocumentTitle";

/** The "Prints page" document (heading, description, border width), if it exists. */
export const loadPrintsPage = () =>
  client.queries.printsPage({ relativePath: "prints.md" }).catch(() => null);

export const loader = async () => {
  const [page, prints] = await Promise.all([
    client.queries.printsPage({ relativePath: "prints.md" }),
    client.queries.printConnection({ first: 100 }),
  ]);
  return { page, prints };
};

export default function Prints() {
  const loaded = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  // The page document must be registered first: Tina's editor opens the first
  // document a page registers, and otherwise that would be the first print.
  const page = useTina(loaded.page).data.printsPage;
  const { data } = useTina(loaded.prints);
  const site = useSite();
  const prints = visiblePrints(toPrints(data));
  const heading = page.title || "Prints";

  useDocumentTitle(heading, site.artistName);

  return (
    <>
      <header className="container page prints-intro">
        <h1 data-tina-field={tinaField(page, "title")}>
          {heading}
        </h1>
        {page.body && (
          <div className="prose" data-tina-field={tinaField(page, "body")}>
            <TinaMarkdown content={page.body} />
          </div>
        )}
      </header>

      <section className="container section" aria-label="Prints">
        {prints.length === 0 ? (
          <p className="muted">No prints available yet.</p>
        ) : (
          <ul className="grid">
            {prints.map((p) => (
              <li key={p.id}>
                <PrintCard print={p} borderWidth={page.borderWidth} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
