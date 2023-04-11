import { TransferData } from "../../utils/types";
import {
  SubmitHandler,
  UseFormRegister,
  Control,
  UseFormHandleSubmit,
  FieldErrors,
  useWatch,
} from "react-hook-form";
import Input from "../Shared/UI/Input";
import SelectInput from "../Shared/UI/Select";
import Button from "../Shared/UI/Button";
import { defaultValues } from "../../pages/NewTransfer";
import InputNumberFormat from "../Shared/UI/InputNumberFormat";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  getExchangeRate,
  numWithCommas,
  numWithoutCommas,
} from "../../utils/auxFunctions";

const currency_options = [
  { value: "URU", label: "$ (URU)" },
  { value: "USD", label: "U$S (USD)" },
  { value: "EU", label: "EUR (EU)" },
];

let render = 0;

type NTFormProps = {
  onSubmit: SubmitHandler<TransferData>;
  register: UseFormRegister<any>;
  control: Control<any, any>;
  handleSubmit: UseFormHandleSubmit<any>;
  errors: FieldErrors<any>;
  reset: (values: TransferData) => void;
  rates: { usd: number; eu: number };
  isLoading: boolean;
};
function NewTransferForm({
  onSubmit,
  register,
  control,
  handleSubmit,
  errors,
  reset,
  rates,
  isLoading,
}: NTFormProps) {
  const accounts = useSelector((state: RootState) => state.myAccounts);
  const account_options = accounts.map(({ id }) => {
    return { value: `${id}`, label: `${id}` };
  });

  const currency_watched = useWatch({
    control,
    name: "currency_name",
    defaultValue: "",
  });
  const account_from_watched = useWatch({
    control,
    name: "account_from",
    defaultValue: "",
  });
  const amount_watched = useWatch({
    control,
    name: "amount",
    defaultValue: "",
  });

  const account = accounts.find(({ id }) => id == account_from_watched);
  const currency_from = account?.currency.name;
  let exchangeRate, toBeDebited;
  if (currency_watched && currency_from && currency_from !== currency_watched) {
    exchangeRate = getExchangeRate(currency_from, currency_watched, rates);
    if (amount_watched)
      toBeDebited = exchangeRate * numWithoutCommas(amount_watched);
  }
  render++;
  return (
    <>
      {isLoading && <p>Loading...</p>}
      {/*<p>{`Render count: ${render}`}</p>*/}
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset style={{ border: "0" }} disabled={isLoading}>
          <SelectInput
            register={register}
            options={account_options}
            className={"select"}
            control={control}
            placeholder="Account From"
            name="account_from"
            hasError={Boolean(errors.account_from)}
            errorMessage={errors.account_from?.message?.toString()}
          />
          <SelectInput
            {...{ register, control }}
            options={currency_options}
            className={"select"}
            placeholder="Currency"
            name="currency_name"
            hasError={Boolean(errors.currency_name)}
            errorMessage={errors.currency_name?.message?.toString()}
          />
          {currency_from && exchangeRate && (
            <p>{`Exchange rate: ${numWithCommas(
              exchangeRate
            )} ${currency_from}`}</p>
          )}
          <InputNumberFormat
            {...{ register, control }}
            hasError={Boolean(errors.amount)}
            errorMessage={errors.amount?.message?.toString()}
            name="amount"
            placeholder="Amount"
          />
          {currency_from && toBeDebited && (
            <p>{`To be Debited: ${numWithCommas(
              toBeDebited
            )} ${currency_from}`}</p>
          )}
          <Input
            register={register}
            name="account_to"
            placeholder="Account To"
            type="number"
            min="0"
            hasError={Boolean(errors.account_to)}
            errorMessage={errors.account_to?.message?.toString()}
          />
          <textarea {...register("description")} placeholder="Reference" />
          {errors.description && (
            <>
              <p style={{ color: "red" }}>
                {errors.description.message?.toString()}
              </p>
              <br />
            </>
          )}
          <Button
            style={{ fontSize: "15px", padding: "10px 50px" }}
            type="submit"
            buttonLabel="Confirm"
          />
          <br />
          <Button
            buttonLabel="Reset Form"
            onClick={() => reset(defaultValues)}
          />
        </fieldset>
      </form>
    </>
  );
}

export default NewTransferForm;
