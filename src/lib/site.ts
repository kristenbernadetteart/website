import type React from "react";
import { useOutletContext } from "react-router-dom";
import type client from "../../tina/__generated__/client";

type SettingsResult = Awaited<ReturnType<typeof client.queries.settings>>;

/** Site settings document, with Tina's visual-editing metadata attached. */
export type Site = SettingsResult["data"]["settings"];

/** Read the site settings that <Layout /> passes down through <Outlet />. */
export const useSite = () => useOutletContext<Site>();

/** Inline style for a print's mat: sets the white border width (0–40px, default 12). */
export const printBorderStyle = (width?: number | null) =>
  ({
    "--print-border": `${Math.min(Math.max(width ?? 12, 0), 40)}px`,
  }) as React.CSSProperties;
