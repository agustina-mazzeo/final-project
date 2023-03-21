import AuthForm from "../components/Auth/AuthForm";
import Button from "../components/UI/Button";
import { useNavigate } from "react-router-dom";

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
export default AuthPage;
