import {
  Link,
  NavLink,
  Outlet,
  ScrollRestoration,
  useLoaderData,
} from "react-router-dom";
import { tinaField, useTina } from "tinacms/dist/react";
import client from "../../tina/__generated__/client";
import SocialIcon, { socialLabel } from "./SocialIcons";

export const loader = () =>
  client.queries.settings({ relativePath: "site.json" });

export default function Layout() {
  const { data } = useTina(
    useLoaderData() as Awaited<ReturnType<typeof loader>>,
  );
  const site = data.settings;

  const socials = (site.socials ?? []).flatMap((s) =>
    s?.url && s.platform ? [{ ...s, url: s.url, platform: s.platform }] : [],
  );

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

          <div className="site-footer__contact">
            <a
              href={`mailto:${site.contactEmail}`}
              data-tina-field={tinaField(site, "contactEmail")}
            >
              {site.contactEmail}
            </a>

            {socials.length > 0 && (
              <ul className="socials" aria-label="Social media">
                {socials.map((s, i) => (
                  <li key={`${s.platform}-${i}`}>
                    <a
                      className="socials__link"
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={socialLabel(s.platform)}
                      title={socialLabel(s.platform)}
                      data-tina-field={tinaField(s, "url")}
                    >
                      <SocialIcon platform={s.platform} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </footer>

      <ScrollRestoration />
    </>
  );
}