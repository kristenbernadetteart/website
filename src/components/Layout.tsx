import {
  Link,
  NavLink,
  Outlet,
  ScrollRestoration,
  useLoaderData,
} from "react-router-dom";
import { tinaField, useTina } from "tinacms/dist/react";
import client from "../../tina/__generated__/client";

export const loader = () =>
  client.queries.settings({ relativePath: "site.json" });

export default function Layout() {
  const { data } = useTina(
    useLoaderData() as Awaited<ReturnType<typeof loader>>,
  );
  const site = data.settings;

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="container site-header__inner">
          <Link
            to="/"
            className="site-header__brand"
            data-tina-field={tinaField(site, "artistName")}
          >
            {site.artistName}
          </Link>
          <nav aria-label="Primary">
            <ul className="site-nav">
              <li>
                <NavLink to="/" end>
                  Work
                </NavLink>
              </li>
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
              <li>
                <a href={`mailto:${site.contactEmail}`}>Contact</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main">
        <Outlet context={site} />
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <div>
            <p className="site-footer__name">
              &copy; {new Date().getFullYear()} {site.artistName}
            </p>
            {site.footerNote && (
              <p
                className="site-footer__note"
                data-tina-field={tinaField(site, "footerNote")}
              >
                {site.footerNote}
              </p>
            )}
          </div>
          <ul className="site-footer__links">
            <li>
              <a
                href={`mailto:${site.contactEmail}`}
                data-tina-field={tinaField(site, "contactEmail")}
              >
                {site.contactEmail}
              </a>
            </li>
            {site.instagram && (
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
            )}
          </ul>
        </div>
      </footer>

      <ScrollRestoration />
    </>
  );
}
