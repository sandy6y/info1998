import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CollectedProvider } from "./context/CollectedContext";
import ErrorPage from "./pages/Error";
import RootLayout from "./layouts/RootLayout";
import LibraryLayout from "./layouts/LibraryLayout";
import { PATHS } from "./constants/Navigation";
import { SPATHS } from "./constants/SeriesNavigation"
import "./index.css";

const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        ...PATHS.map((item) => ({
          path: item.link,
          element: item.element,
        })),

      {
        path: "library",
        element: <LibraryLayout />,
        children: SPATHS.map((item) => ({
          path: item.link, 
          element: item.element,
        })),
      },

      ]
    },
]);

export default function App() {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <CollectedProvider>
              <RouterProvider router={router} />
            </CollectedProvider>
        </MantineProvider>
    );
}