import { Account, TransferData } from "../../utils/types";
import {
  SubmitHandler,
  useController,
  UseFormRegister,
  Control,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { useLoaderData } from "react-router-dom";
import Input from "../Shared/UI/Input";
import SelectInput from "../Shared/UI/Select";

const currency_options = [
  { value: "URU", label: "$ (URU)" },
  { value: "USD", label: "U$S (USD)" },
  { value: "EU", label: "EUR (EU)" },
];

type NTFormProps = {
  onSubmit: SubmitHandler<TransferData>;
  register: UseFormRegister<any>;
  control: Control<any, any>;
  handleSubmit: UseFormHandleSubmit<any>;
  errors: FieldErrors<any>;
};
function NewTransferForm({
  onSubmit,
  register,
  control,
  handleSubmit,
  errors,
}: NTFormProps) {
  const accounts = useLoaderData() as Account[];
  const account_options = accounts.map(({ id }) => {
    return { value: `${id}`, label: `${id}` };
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SelectInput
        register={register}
        options={account_options}
        className={"select"}
        control={control}
        placeholder="Account From"
        name="account_from"
        rules={{ required: true }}
        hasError={Boolean(errors.account_from)}
        errorMessage="This field is required"
      />
      <SelectInput
        register={register}
        options={currency_options}
        className={"select"}
        control={control}
        placeholder="Currency"
        name="currency_name"
        rules={{ required: true }}
        hasError={Boolean(errors.currency_name)}
        errorMessage="This field is required"
      />
      <Input
        register={register}
        name="amount"
        rules={{ required: true }}
        placeholder="Amount"
        type="number"
        step=".01"
        hasError={Boolean(errors.amount)}
        errorMessage={"This field is required"}
      />
      <Input
        register={register}
        name="account_to"
        rules={{ required: true }}
        placeholder="Account To"
        type="number"
        hasError={Boolean(errors.account_to)}
        errorMessage={"This field is required"}
      />
      <textarea
        {...register("description", { maxLength: 128 })}
        placeholder="Reference"
      />
      {errors.description && <span>Max length 128 chars</span>}
      <input type="submit" />
    </form>
  );
}

export default NewTransferForm;
