import { redirect } from "react-router-dom";
import { index } from "../routes/routes";
import { getAuthToken } from "../utils/token";

function HomePage() {
    return <div>Home Page</div>
}

export default HomePage

export const loaderRouteProtection = () => {
    if (!getAuthToken()) {
      return redirect(index);
    }
    return null;
  };