import { SubmitHandler, useForm } from "react-hook-form";
import { Rates, TransferData } from "../utils/types";
import NewTransferForm from "../components/Transfer/NewTransferForm";
import Confirmation from "../components/Transfer/Confirmation";
import { useEffect, useState } from "react";
import { getRates } from "../service/transactions/transfer";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { getExchangeRate, numWithoutCommas } from "../utils/auxFunctions";
import { getAccounts } from "../service/users/accounts";
import { accountsActions } from "../store/accounts";

let render = 0;

export const defaultValues: TransferData = {
  account_from: "",
  currency_name: "",
  account_to: "",
  amount: "",
  description: "",
};

function NewTransferPage() {
  const dispatch = useDispatch();
  const [isShown, setIsShown] = useState(false);
  const [rates, setRates] = useState<Rates>({
    usd: 0,
    eu: 0,
  });
  const [data, setData] = useState<TransferData>(defaultValues);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const reset = async () => {
      const [rates, accounts] = await Promise.all([getRates(), getAccounts()]);
      if (rates.error || accounts.error) {
        window.alert("An unexpected error ocurred");
        return;
      }
      setRates(rates.data);
      dispatch(accountsActions.addAccounts({ accounts }));
      setIsLoading(false);
    };
    reset();
  }, []);
  const accounts = useSelector((state: RootState) => state.myAccounts);
  const transferSchema = z
    .object({
      account_from: z
        .string({
          invalid_type_error: "This field is required",
        })
        .min(1, { message: "This field is required" }),
      currency_name: z
        .string({ invalid_type_error: "This field is required" })
        .min(1, { message: "This field is required" }),
      amount: z.coerce.string().min(1, { message: "This field is required" }),
      account_to: z.string().min(1, { message: "This field is required" }),
      description: z.string().max(20, { message: "Max length is 128 chars" }),
    })
    .refine((data) => data.account_from !== data.account_to, {
      path: ["account_to"],
      message: "Please enter a different account",
    })
    .refine(
      (data) => {
        const account = accounts.find(({ id }) => id == +data.account_from);
        const currency_from = account?.currency.name;
        let exchangeRate, toBeDebited;
        if (currency_from && data.currency_name)
          exchangeRate = getExchangeRate(
            currency_from,
            data.currency_name,
            rates
          );
        if (exchangeRate)
          toBeDebited = exchangeRate * numWithoutCommas(data.amount);
        return (
          !account ||
          (account && toBeDebited && account.balance - toBeDebited >= 0)
        );
      },
      { path: ["amount"], message: "Not enough funds!" }
    );
  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TransferData>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(transferSchema),
  });

  const onSubmitHandler: SubmitHandler<TransferData> = (data: TransferData) => {
    const dataNum: TransferData = {
      ...data,
      account_from: +data.account_from,
      account_to: +data.account_to,
      amount: numWithoutCommas(`${data.amount}`),
    };
    setData(dataNum);
    setIsShown(true);
  };

  render++;
  return (
    <div
      style={{ position: "relative", width: "100%", justifyContent: "center" }}
    >
      <h3>New Transfer</h3>
      {/*<p>Render count: {render}</p>*/}
      <NewTransferForm
        {...{
          register,
          handleSubmit,
          errors,
          control,
          reset,
          rates,
          isLoading,
        }}
        onSubmit={onSubmitHandler}
      />
      {isShown && (
        <Confirmation {...{ data, reset, defaultValues, setIsShown }} />
      )}
    </div>
  );
}
export default NewTransferPage;
