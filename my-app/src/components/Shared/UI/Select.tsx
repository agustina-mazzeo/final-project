import { UseFormRegister, useController } from "react-hook-form";
import { SingleValue } from "react-select";
import Select from "react-select";
type SelectProps = {
  register: UseFormRegister<any>;
  rules: any;
  hasError: boolean;
  errorMessage: string;
  options: { value: string; label: string }[];
  className: string;
  name: string;
  placeholder: string;
  control: any;
};
function SelectInput({
  register,
  rules,
  options,
  hasError,
  errorMessage,
  className,
  name,
  placeholder,
  control,
}: SelectProps) {
  const {
    field: { value: field_value, onChange: OnChangeField, ...restLangField },
  } = useController({ name, control });
  return (
    <>
      <Select
        {...register(name, rules)}
        {...{ options, className, placeholder}}
        isSearchable={false}
        isClearable
        value={
          field_value
            ? options.find((x) => x.value === field_value)
            : field_value
        }
        onChange={(option) => OnChangeField(option ? option.value : option)}
        {...restLangField}
      />
      {hasError && <p style={{ color: "red" }}>{errorMessage}</p>}
    </>
  );
}
export default SelectInput;
