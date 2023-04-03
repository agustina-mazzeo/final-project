import { SubmitHandler, useForm } from "react-hook-form";
import { TransferData } from "../utils/types";
import NewTransferForm from "../components/Transfer/NewTransferForm";
import Confirmation from "../components/Transfer/Confirmation";
import { useState } from "react";
import { postTransaction } from "../service/transactions/transfer";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ROUTE_HOME } from "../routes/routes";

const customError: z.ZodErrorMap = (error, ctx) => {
  if (error.code === z.ZodIssueCode.invalid_type) {
    if (error.expected === "string") {
      return { message: `This field is required` };
    }
  }
  return { message: ctx.defaultError };
};

const transferSchema = z
  .object({
    account_from: z
      .string({ errorMap: customError })
      .min(1, { message: "This field is required" }),
    currency_name: z
      .string({ errorMap: customError })
      .min(1, { message: "This field is required" }),
    amount: z.string().min(1, { message: "This field is required" }),
    account_to: z.string().min(1, { message: "This field is required" }),
    description: z
      .string()
      .max(128, { message: "Max length is 128 chars" })
      .optional(),
  })
  .refine((data) => data.account_from !== data.account_to, {
    path: ["account_to"],
    message: "Please enter a different account",
  });

export const defaultValues: TransferData = {
  account_from: "",
  currency_name: "",
  account_to: "",
  amount: "",
  description: "",
};

function NewTransferPage() {
  const navigate = useNavigate();
  const [isShown, setIsShown] = useState(false);
  const [data, setData] = useState<TransferData>(defaultValues);
  const [isLoading, setIsLoading] = useState(false);
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
      amount: +data.amount,
    };
    setData(dataNum);
    setIsShown(true);
  };

  const send = async (data: TransferData) => {
    setIsLoading(true);
    console.log(data);
    const response = await postTransaction(data);
    setIsLoading(false);
    if (response.error) {
      console.log(response.error);
      //handle the error
      return;
    }
    reset(defaultValues);
    setIsShown(false);
    console.log("transfer successful");
    navigate(ROUTE_HOME);
  };

  return (
    <div
      style={{ position: "relative", width: "100%", justifyContent: "center" }}
    >
      <h3>New Transfer</h3>

      <NewTransferForm
        {...{ register, handleSubmit, errors, control, reset }}
        onSubmit={onSubmitHandler}
      />
      {isShown && (
        <Confirmation onClose={setIsShown} {...{ data, send, isLoading }} />
      )}
    </div>
  );
}
export default NewTransferPage;
