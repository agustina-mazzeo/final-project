import { createBrowserRouter } from "react-router-dom";
import AuthPage from "../pages/Auth";
import HomePage, {loaderRouteProtection} from "../pages/Home";

export const ROUTE_INDEX = "/";
export const ROUTE_HOME = "/home";

export const router = createBrowserRouter([
  {
    path: ROUTE_INDEX,
    element: <AuthPage />,
  },
  {
    path: ROUTE_HOME,
    element: <HomePage />,
    loader: loaderRouteProtection
  },
]);
