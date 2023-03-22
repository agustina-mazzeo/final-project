import { createBrowserRouter } from "react-router-dom";
import AuthPage, { loaderRouteAuthenticated } from "../pages/Auth";
import HomePage, { loader as accountsLoader } from "../pages/Home";
import RootLayout, { loaderRouteNotAuthenticated } from "../pages/Root";

export const ROUTE_INDEX = "/";
export const ROUTE_HOME = "/home";

export const router = createBrowserRouter([
  {
    path: ROUTE_INDEX,
    element: <AuthPage />,
    loader: loaderRouteAuthenticated,
  },
  {
    path: ROUTE_HOME,
    element: <RootLayout />,
    loader: loaderRouteNotAuthenticated,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: accountsLoader,
      },
    ],
  },
]);
