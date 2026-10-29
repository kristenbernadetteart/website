import { useLoaderData } from "react-router-dom";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { tinaField, useTina } from "tinacms/dist/react";
import client from "../../tina/__generated__/client";
import PrintCard from "../components/PrintCard";
import { toPrints, visiblePrints } from "../lib/prints";
import { useSite } from "../lib/site";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export const loader = async () => {
  const [prints, page] = await Promise.all([
    client.queries.printConnection({ first: 100 }),
    // The heading and intro come from the "prints" page under Pages, if it exists.
    client.queries.page({ relativePath: "prints.mdx" }).catch(() => null),
  ]);
  return { prints, page };
};

export default function Prints() {
  const loaded = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useTina(loaded.prints);
  const site = useSite();
  const prints = visiblePrints(toPrints(data));

  useDocumentTitle("Prints", site.artistName);

  return (
    <>
      {loaded.page ? <PrintsIntro result={loaded.page} /> : <DefaultIntro />}

      <section className="container section" aria-label="Prints">
        {prints.length === 0 ? (
          <p className="muted">No prints available yet.</p>
        ) : (
          <ul className="grid">
            {prints.map((p) => (
              <li key={p.id}>
                <PrintCard print={p} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

type PageResult = NonNullable<
  Awaited<ReturnType<typeof loader>>["page"]
>;

function PrintsIntro({ result }: { result: PageResult }) {
  const { data } = useTina(result);
  const page = data.page;

  return (
    <header className="container page prints-intro">
      <h1 data-tina-field={tinaField(page, "title")}>{page.title}</h1>
      <div className="prose" data-tina-field={tinaField(page, "body")}>
        <TinaMarkdown content={page.body} />
      </div>
    </header>
  );
}

function DefaultIntro() {
  return (
    <header className="container page prints-intro">
      <h1>Prints</h1>
    </header>
  );
}
