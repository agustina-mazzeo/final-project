import React from "react";
type ButtonProps = {
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
  disabled?: boolean;
  buttonLabel: string;
  style?: React.CSSProperties;
};
const Button = ({ buttonLabel, type = "button", ...props }: ButtonProps) => {
  return (
    <button {...props} type={type}>
      {buttonLabel}
    </button>
  );
};

export default React.memo(Button);
