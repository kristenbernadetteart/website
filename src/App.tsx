import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout, { loader as layoutLoader } from "./components/Layout";
import Home, { loader as homeLoader } from "./pages/Home";
import Painting, { loader as paintingLoader } from "./pages/Painting";
import Page, { loader as pageLoader } from "./pages/Page";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    loader: layoutLoader,
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, loader: homeLoader, element: <Home /> },
      {
        path: "work/:slug",
        loader: paintingLoader,
        element: <Painting />,
        errorElement: <NotFound />,
      },
      {
        path: ":slug",
        loader: pageLoader,
        element: <Page />,
        errorElement: <NotFound />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
