import { createBrowserRouter } from "react-router-dom";
import AuthPage, { loaderRouteAuthenticated } from "../pages/Auth";
import HomePage, { loader as accountsLoader } from "../pages/Home";
import NewTransferPage from "../pages/NewTransfer";
import RootLayout, { loaderRouteNotAuthenticated } from "../pages/Root";
import TransactionsPage, {loader as txnLoader}from "../pages/Transactions";
import { loaderErrorPage } from "../utils/loaders";

export const ROUTE_AUTH = "/authentication";
export const ROUTE_HOME = "/";
export const ROUTE_TRANSACTIONS = "transactions";
export const ROUTE_TRANSFER_FORM = "transfer";

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
        id: ROUTE_HOME,
        element: <HomePage />,
        loader: accountsLoader,
      },
      {
        path: ROUTE_TRANSACTIONS,
        element: <TransactionsPage />,
        loader: txnLoader,
      },
      {
        path: ROUTE_TRANSFER_FORM,
        element: <NewTransferPage />,
        loader: accountsLoader,
      },
    ],
  },
  { path: "*", loader: loaderErrorPage },
]);
