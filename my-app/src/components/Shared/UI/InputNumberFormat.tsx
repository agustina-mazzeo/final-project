import {
  UseFormRegister,
  useController,
  Control,
  RegisterOptions,
} from "react-hook-form";
import { NumericFormat } from "react-number-format";
type InputNumericProps = {
  register: UseFormRegister<any>;
  hasError: boolean;
  errorMessage?: string;
  name: string;
  placeholder: string;
  control: Control<any>;
};
function InputNumberFormat({
  register,
  hasError,
  errorMessage,
  name,
  placeholder,
  control,
}: InputNumericProps) {
  const {
    field: { value: field_value, onChange: OnChangeField, ...restLangField },
  } = useController({ name, control });
  const { ref, ...otherProps } = register(name);
  return (
    <>
      <NumericFormat
        {...otherProps}
        {...{ placeholder }}
        getInputRef={ref}
        thousandSeparator={true}
        decimalScale={2}
        allowNegative={false}
        onValueChange={(value) => {
          OnChangeField(value.floatValue);
        }}
        value={field_value}
      />
      {hasError && errorMessage && (
        <p style={{ color: "red" }}>{errorMessage}</p>
      )}
    </>
  );
}
export default InputNumberFormat;
