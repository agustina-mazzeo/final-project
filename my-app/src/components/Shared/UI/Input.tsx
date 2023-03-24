type InputProps = {
  label?: string;
  placeholder?: string;
  type?: string;
  id?: string;
  style?: React.CSSProperties;
  required?: boolean;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (event:React.MouseEvent<HTMLDivElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  value?: string;
  hasError?: boolean;
  errorMessage?: string;
};
const Input = ({onClick, hasError, errorMessage, label, ...props }: InputProps) => {
  return (
    <div onClick={onClick}>
      {label && <label htmlFor={props.id}>{label}</label>}
      <br/>
      <input {...props} />
      {hasError && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};
export default Input;
