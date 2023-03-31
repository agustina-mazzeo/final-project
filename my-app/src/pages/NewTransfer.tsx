import { SubmitHandler, useForm } from "react-hook-form";
import { TransferData } from "../utils/types";

import NewTransferForm from "../components/Transfer/NewTransferForm";


export const defaultValues = {
  account_from: "",
  currency_name: "",
  account_to: "",
  amount: "",
  description: "",
};

function NewTransferPage() {
  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TransferData>({
    defaultValues,
  });

  const onSubmitHandler: SubmitHandler<TransferData> = (data: TransferData) => {
    console.log(data);
    reset(defaultValues);
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
    </div>
  );
}
export default NewTransferPage;

