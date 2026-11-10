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
import type { Site } from "../lib/site";

export const loader = async () => {
  const [settings, menu] = await Promise.all([
    client.queries.settings({ relativePath: "site.json" }),
    client.queries.menu({ relativePath: "menu.json" }).catch(() => null),
  ]);
  return { settings, menu };
};

type MenuResult = NonNullable<Awaited<ReturnType<typeof loader>>["menu"]>;
type Menu = MenuResult["data"]["menu"];

export default function Layout() {
  const loaded = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useTina(loaded.settings);
  const site = data.settings;

  const headerText = site.headerText || site.artistName;
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
                alt=""
                style={{ height: logoHeight }}
                data-tina-field={tinaField(site, "logo")}
              />
            )}
            {/* With a logo, the text is visually hidden but still read by screen readers. */}
            <span
              className={site.logo ? "sr-only" : undefined}
              data-tina-field={tinaField(
                site,
                site.headerText ? "headerText" : "artistName",
              )}
            >
              {headerText}
            </span>
          </Link>
          {loaded.menu ? (
            <LiveNav site={site} result={loaded.menu} />
          ) : (
            <SiteNav site={site} />
          )}
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
/** The menu with live editing, when the Menu document exists. */
function LiveNav({ site, result }: { site: Site; result: MenuResult }) {
  const { data } = useTina(result);
  return <SiteNav site={site} menu={data.menu} />;
}

function SiteNav({ site, menu }: { site: Site; menu?: Menu }) {
  return (
    <nav aria-label="Primary">
      <ul className="site-nav">
        {navItems(site, menu).map((item, i) => (
          <li key={`${item.link}-${i}`}>
            {item.link === "contact" ? (
              <a href={`mailto:${site.contactEmail}`} data-tina-field={item.field}>
                {item.label}
              </a>
            ) : (
              <NavLink
                to={NAV_PATHS[item.link]}
                end={item.link === "gallery"}
                data-tina-field={item.field}
              >
                {item.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

type NavLinkKey = "gallery" | "prints" | "about" | "contact";

const NAV_PATHS: Record<Exclude<NavLinkKey, "contact">, string> = {
  gallery: "/",
  prints: "/prints",
  about: "/about",
};

const DEFAULT_NAV: NavLinkKey[] = ["gallery", "prints", "about", "contact"];

const isNavKey = (v: unknown): v is NavLinkKey =>
  typeof v === "string" && (DEFAULT_NAV as string[]).includes(v);

/** Header menu links from settings, or the default menu when none are set. */
function navItems(site: Site, menu: Menu | undefined) {
  const defaultLabel = (link: NavLinkKey) =>
    ({
      gallery: site.galleryLabel || "Work",
      prints: "Prints",
      about: "About",
      contact: "Commissions",
    })[link];

  const configured = (menu?.links ?? []).flatMap((item) =>
    item && isNavKey(item.link)
      ? [
          {
            link: item.link,
            label: item.label || defaultLabel(item.link),
            field: tinaField(item, "label"),
          },
        ]
      : [],
  );
  if (configured.length > 0) return configured;

  return DEFAULT_NAV.map((link) => ({
    link,
    label: defaultLabel(link),
    field: link === "gallery" ? tinaField(site, "galleryLabel") : undefined,
  }));
}

/** Point the page's <link rel="icon"> at the CMS favicon, if one is set. */
function useFavicon(href?: string | null) {
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (link) link.href = href || "/favicon.ico";
  }, [href]);
}
