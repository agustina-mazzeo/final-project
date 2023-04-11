import Button from "../Shared/UI/Button";
import Input from "../Shared/UI/Input";
import useInput from "../../hooks/use-input";
import { useSearchParams, useNavigate } from "react-router-dom";
import { userData, signup, login } from "../../service/users/userAuth";
import { ROUTE_HOME, ROUTE_AUTH } from "../../routes/routes";
import { setAuthorizationToken } from "../../service";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";

function AuthForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    value: nameValue,
    isValid: nameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetName,
  } = useInput((value: string) => value.trim() !== "");
  const {
    value: lastNameValue,
    isValid: lastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
    reset: resetLastName,
  } = useInput((value: string) => value.trim() !== "");
  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput((value: string) => value.includes("@"));
  const {
    value: passwordValue,
    isValid: passIsValid,
    hasError: passHasError,
    valueChangeHandler: passChangeHandler,
    inputBlurHandler: passBlurHandler,
    reset: resetPassword,
  } = useInput(
    (value: string) => value.trim() !== "" && value.trim().length >= 8
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";

  let formIsValid = false;
  if (isLogin) {
    formIsValid = emailIsValid && passIsValid;
  } else {
    formIsValid = emailIsValid && passIsValid && nameIsValid && lastNameIsValid;
  }

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formIsValid) {
      return;
    }

    if (!isLogin) {
      const data: userData = {
        name: `${nameValue.trim()} ${lastNameValue.trim()}`,
        email: emailValue,
        password: passwordValue,
      };
      const response = await signup(data);
      if (response.error) {
        window.alert(response.error);
      } else {
        window.alert("User created with success!");
        navigate(ROUTE_AUTH);
      }
    } else {
      //login
      const data: userData = {
        email: emailValue,
        password: passwordValue,
      };
      const response = await login(data);
      console.log(response);
      if (response.error) {
        window.alert(response.error);
        //navigate(ROUTE_AUTH);
      } else {
        const token: string = response.token;
        setAuthorizationToken(token);
        dispatch(authActions.login({ name: response.name }));
        //window.alert("User logged with success!");
        navigate(ROUTE_HOME);
      }
    }

    resetName();
    resetLastName();
    resetEmail();
    resetPassword();
  };
  return (
    <form onSubmit={submitHandler}>
      <h4>{isLogin ? "LogIn" : "SignUp"}</h4>
      {!isLogin && (
        <>
          <Input
            value={nameValue}
            onChange={nameChangeHandler}
            onBlur={nameBlurHandler}
            label="Name"
            id="name"
            hasError={nameHasError}
            errorMessage="Please enter a Name"
          />

          <Input
            value={lastNameValue}
            onChange={lastNameChangeHandler}
            onBlur={lastNameBlurHandler}
            label="Last Name"
            id="last-name"
            hasError={lastNameHasError}
            errorMessage="Please enter a Last Name"
          />
        </>
      )}
      <Input
        value={emailValue}
        onChange={emailChangeHandler}
        onBlur={emailBlurHandler}
        label="Email"
        id="email"
        hasError={emailHasError}
        errorMessage="Please enter a valid email"
        required
      />
      <Input
        value={passwordValue}
        onChange={passChangeHandler}
        onBlur={passBlurHandler}
        label="Password"
        type="password"
        id="password"
        hasError={passHasError}
        errorMessage="Please enter a password with +8 chars"
        required
      />
      <Button
        disabled={!formIsValid}
        type="submit"
        buttonLabel={isLogin ? "LogIn" : "SignUp"}
      />
    </form>
  );
}
export default AuthForm;
