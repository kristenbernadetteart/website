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
  const [prints, page] = await Promise.all([
    client.queries.printConnection({ first: 100 }),
    loadPrintsPage(),
  ]);
  return { prints, page };
};

export type PrintsPageResult = NonNullable<
  Awaited<ReturnType<typeof loadPrintsPage>>
>;
type PrintsPage = PrintsPageResult["data"]["printsPage"];
type PrintsResult = Awaited<ReturnType<typeof loader>>["prints"];

export default function Prints() {
  const loaded = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  return loaded.page ? (
    <LivePrints prints={loaded.prints} page={loaded.page} />
  ) : (
    <PrintsView prints={loaded.prints} />
  );
}

/** With live editing of the Prints page document. */
function LivePrints({
  prints,
  page,
}: {
  prints: PrintsResult;
  page: PrintsPageResult;
}) {
  const { data } = useTina(page);
  return <PrintsView prints={prints} page={data.printsPage} />;
}

function PrintsView({
  prints: result,
  page,
}: {
  prints: PrintsResult;
  page?: PrintsPage;
}) {
  const { data } = useTina(result);
  const site = useSite();
  const prints = visiblePrints(toPrints(data));
  const heading = page?.title || "Prints";

  useDocumentTitle(heading, site.artistName);

  return (
    <>
      <header className="container page prints-intro">
        <h1 data-tina-field={page ? tinaField(page, "title") : undefined}>
          {heading}
        </h1>
        {page?.body && (
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
                <PrintCard print={p} borderWidth={page?.borderWidth} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
