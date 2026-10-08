import {
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { tinaField, useTina } from "tinacms/dist/react";
import client from "../../tina/__generated__/client";
import { useSite } from "../lib/site";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export const loader = ({ params }: LoaderFunctionArgs) =>
  client.queries.page({ relativePath: `${params.slug}.mdx` });

export default function Page() {
  const { data } = useTina(
    useLoaderData() as Awaited<ReturnType<typeof loader>>,
  );
  const site = useSite();
  const page = data.page;

  useDocumentTitle(page.title, site.artistName);

  return (
    <article className="container page">
      <div className={page.portrait ? "page__grid" : "page__single"}>
        {page.portrait && (
          <figure className="page__portrait">
            <div className="mat mat--tall">
              <img
                src={page.portrait}
                alt={page.portraitAlt ?? ""}
                data-tina-field={tinaField(page, "portrait")}
              />
            </div>
          </figure>
        )}
        <div>
          <h1 data-tina-field={tinaField(page, "title")}>{page.title}</h1>
          <div className="prose" data-tina-field={tinaField(page, "body")}>
            <TinaMarkdown content={page.body} />
          </div>
        </div>
      </div>
    </article>
  );
}
