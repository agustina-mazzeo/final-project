import { Account, TransferData } from "../../utils/types";
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
import { getAccounts } from "../../service/users/accounts";
import { getRates } from "../../service/transactions/transfer";
import InputNumberFormat from "../Shared/UI/InputNumberFormat";

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
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [rates, setRates] = useState<{ usd: number; eu: number }>({
    usd: 0,
    eu: 0,
  });
  useEffect(() => {
    const getData = async () => {
      const accounts = await getAccounts();
      setAccounts(accounts.data);
      try {
        const rates = await getRates();
        setRates(rates.data);
      } catch (error) {
        console.log("couldnt fetch rates");
      }
      setIsLoading(false);
    };
    getData();
  }, []);

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
  return (
    <>
      {isLoading && <p>Loading...</p>}
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
        {currency_from && exchangeRate && (
          <p>{`Exchange rate: ${formatNum(exchangeRate)} ${currency_from}`}</p>
        )}
        <InputNumberFormat
          register={register}
          rules={{ required: true }}
          hasError={Boolean(errors.amount)}
          errorMessage={"This field is required"}
          name="amount"
          placeholder="Amount"
          control={control}
        />
        {currency_from && toBeDebited && (
          <p>{`To be Debited: ${formatNum(toBeDebited)} ${currency_from}`}</p>
        )}
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

        <Button
          style={{ fontSize: "15px", padding: "10px 50px" }}
          type="submit"
          buttonLabel="Confirm"
        />
        <br />
        <Button buttonLabel="Reset Form" onClick={() => reset(defaultValues)} />
      </form>
    </>
  );
}

export default NewTransferForm;
