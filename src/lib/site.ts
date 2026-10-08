import { useOutletContext } from "react-router-dom";
import type client from "../../tina/__generated__/client";

type SettingsResult = Awaited<ReturnType<typeof client.queries.settings>>;

/** Site settings document, with Tina's visual-editing metadata attached. */
export type Site = SettingsResult["data"]["settings"];

/** Read the site settings that <Layout /> passes down through <Outlet />. */
export const useSite = () => useOutletContext<Site>();
