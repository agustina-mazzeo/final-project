import { UseFormRegister } from "react-hook-form";
import { ChangeEventHandler } from "react";

type InputProps = {
  label?: string;
  style?: React.CSSProperties;
  id?: string;
  name?: string;
  type?: string;
  min?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  step?: string;
  register?: UseFormRegister<any>;
  hasError?: boolean;
  errorMessage?: string;
  rules?: any
};
const Input = ({
  onClick,
  hasError,
  errorMessage,
  label,
  register,
  name,
  rules, 
  ...props
}: InputProps) => {
  return (
    <div onClick={onClick}>
      {label && (
        <label style={{ textAlign: "left" }} htmlFor={props.id}>
          {label}
        </label>
      )}
      <input {...props} {...(register && name && register(name, rules))} />
      {hasError && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};
export default Input;
