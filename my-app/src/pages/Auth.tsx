import AuthForm from "../components/Auth/AuthForm";
import Button from "../components/UI/Button";
import { redirect, useNavigate } from "react-router-dom";
import { getAuthToken } from "../utils/token";
import { setAuthorizationToken } from "../service";
import { ROUTE_HOME } from "../routes/routes";

function AuthPage() {
  const navigate = useNavigate();
  const onRegisterHandler = (path: string) => {
    navigate(path);
  };
  return (
    <>
      <Button
        type="button"
        buttonLabel="Signup"
        onClick={() => onRegisterHandler("/?mode=signup")}
      />
      <Button
        type="button"
        buttonLabel="Login"
        onClick={() => onRegisterHandler("/?mode=login")}
      />
      <AuthForm />
    </>
  );
}

export const loaderRouteAuthenticated = () => {
  const token = getAuthToken()
if (token) {
  setAuthorizationToken(token)
  return redirect(ROUTE_HOME);
}
return null;
};
export default AuthPage;
