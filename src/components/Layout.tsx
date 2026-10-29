import {
  Link,
  NavLink,
  Outlet,
  ScrollRestoration,
  useLoaderData,
} from "react-router-dom";
import { tinaField, useTina } from "tinacms/dist/react";
import { useEffect } from "react";
import client from "../../tina/__generated__/client";
import SocialIcon, { socialLabel } from "./SocialIcons";

export const loader = () =>
  client.queries.settings({ relativePath: "site.json" });

export default function Layout() {
  const { data } = useTina(
    useLoaderData() as Awaited<ReturnType<typeof loader>>,
  );
  const site = data.settings;

  const headerText = site.headerText || site.artistName;
  const showText = !site.logo || !site.hideHeaderText;
  const logoHeight = Math.min(Math.max(site.logoHeight || 44, 20), 120);

  useFavicon(site.favicon);

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
          <Link to="/" className="site-header__brand">
            {site.logo && (
              <img
                className="site-header__logo"
                src={site.logo}
                alt={showText ? "" : site.artistName}
                style={{ height: logoHeight }}
                data-tina-field={tinaField(site, "logo")}
              />
            )}
            {showText && (
              <span
                data-tina-field={tinaField(
                  site,
                  site.headerText ? "headerText" : "artistName",
                )}
              >
                {headerText}
              </span>
            )}
          </Link>
          <nav aria-label="Primary">
            <ul className="site-nav">
              <li>
                <NavLink
                  to="/"
                  end
                  data-tina-field={tinaField(site, "galleryLabel")}
                >
                  {site.galleryLabel || "Work"}
                </NavLink>
              </li>
              <li>
                <NavLink to="/prints">Prints</NavLink>
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
/** Point the page's <link rel="icon"> at the CMS favicon, if one is set. */
function useFavicon(href?: string | null) {
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (link) link.href = href || "/favicon.ico";
  }, [href]);
}
