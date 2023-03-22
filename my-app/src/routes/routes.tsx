import { createBrowserRouter } from "react-router-dom";
import AuthPage from "../pages/Auth";
import HomePage, {loaderRouteProtection} from "../pages/Home";

export const index = "/";
export const home = "/home";

export const router = createBrowserRouter([
  {
    path: index,
    element: <AuthPage />,
  },
  {
    path: home,
    element: <HomePage />,
    loader: loaderRouteProtection
  },
]);
