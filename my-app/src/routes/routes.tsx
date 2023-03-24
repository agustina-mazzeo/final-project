import { createBrowserRouter } from "react-router-dom";
import AuthPage, { loaderRouteAuthenticated } from "../pages/Auth";
import HomePage, { loader as accountsLoader } from "../pages/Home";
import RootLayout, { loaderRouteNotAuthenticated } from "../pages/Root";
import TransactionsPage, {loader as txnLoader}from "../pages/Transactions";
import { loaderErrorPage } from "../utils/loaders";

export const ROUTE_AUTH = "/authentication";
export const ROUTE_HOME = "/";
export const ROUTE_TRANSACTIONS = "transactions";

export const router = createBrowserRouter([
  {
    path: ROUTE_AUTH,
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
      {
        path: ROUTE_TRANSACTIONS,
        element: <TransactionsPage />,
        loader: txnLoader,
      },
    ],
  },
  { path: "*", loader: loaderErrorPage },
]);
