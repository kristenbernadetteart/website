import { useLoaderData } from "react-router-dom";
import { useTina } from "tinacms/dist/react";
import client from "../../tina/__generated__/client";
import Hero from "../components/Hero";
import Gallery from "../components/Gallery";
import { toPaintings } from "../lib/paintings";
import { useSite } from "../lib/site";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export const loader = () => client.queries.paintingConnection({ first: 100 });

export default function Home() {
  const { data } = useTina(
    useLoaderData() as Awaited<ReturnType<typeof loader>>,
  );
  const site = useSite();
  const paintings = toPaintings(data);
  const featured = paintings.find((p) => p.featured) ?? paintings[0];

  useDocumentTitle(site.artistName, "Paintings");

  return (
    <>
      <Hero site={site} painting={featured} />
      <Gallery paintings={paintings} />
    </>
  );
}
