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
import { useEffect, useState } from "react";
import { getRates } from "../../service/transactions/transfer";
import InputNumberFormat from "../Shared/UI/InputNumberFormat";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const currency_options = [
  { value: "URU", label: "$ (URU)" },
  { value: "USD", label: "U$S (USD)" },
  { value: "EU", label: "EUR (EU)" },
];

function formatNum(num: number): string {
  return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

type NTFormProps = {
  onSubmit: SubmitHandler<TransferData>;
  register: UseFormRegister<any>;
  control: Control<any, any>;
  handleSubmit: UseFormHandleSubmit<any>;
  errors: FieldErrors<any>;
  reset: (values: TransferData) => void;
};
function NewTransferForm({
  onSubmit,
  register,
  control,
  handleSubmit,
  errors,
  reset,
}: NTFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [rates, setRates] = useState<{ usd: number; eu: number }>({
    usd: 0,
    eu: 0,
  });
  const accounts = useSelector((state: RootState) => state.myAccounts);
  const account_options = accounts.map(({ id }) => {
    return { value: `${id}`, label: `${id}` };
  });

  useEffect(() => {
    const reset = async () => {
      const rates = await getRates();
      if (rates.error) {
        window.alert(rates.error);
        return;
      }
      setRates(rates.data);
      setIsLoading(false);
    };
    reset();
  }, []);

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
  const account_from_balance = account?.balance;
  let exchangeRate, toBeDebited;
  let hasFunds = true;
  if (currency_watched && currency_from !== currency_watched) {
    switch (currency_from) {
      case "URU":
        if (currency_watched === "USD") exchangeRate = rates.usd;
        else exchangeRate = rates.eu;

        break;
      case "USD":
        if (currency_watched === "URU") exchangeRate = 1 / rates.usd;
        else exchangeRate = rates.eu / rates.usd;

        break;
      case "EU":
        if (currency_watched === "USD") exchangeRate = rates.usd / rates.eu;
        else exchangeRate = 1 / rates.eu;
    }
    if (amount_watched && exchangeRate)
      toBeDebited =
        exchangeRate * parseFloat(amount_watched.replaceAll(",", ""));
  }

  if (amount_watched && account_from_balance) {
    if (toBeDebited) hasFunds = account_from_balance - toBeDebited >= 0;
    else
      hasFunds =
        account_from_balance - parseFloat(amount_watched.replaceAll(",", "")) >=
        0;
  }
  
  return (
    <>
      {isLoading && <p>Loading...</p>}
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
            <p>{`Exchange rate: ${formatNum(
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
            <p>{`To be Debited: ${formatNum(toBeDebited)} ${currency_from}`}</p>
          )}
          {!hasFunds && <p style={{ color: "red" }}>Not enough funds!</p>}
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
              <p>{errors.description.message?.toString()}</p>
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
