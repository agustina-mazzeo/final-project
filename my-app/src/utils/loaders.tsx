import { redirect } from "react-router-dom";
import { ROUTE_HOME } from "../routes/routes";

export function loaderErrorPage() {
  return redirect(ROUTE_HOME);
}
