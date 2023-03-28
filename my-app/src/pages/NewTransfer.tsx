import { FormEvent } from "react";
import { useLoaderData } from "react-router-dom";
import Button from "../components/Shared/UI/Button";
import Input from "../components/Shared/UI/Input";
import { Account } from "../utils/types";
function NewTransferPage() {
  const accounts = useLoaderData() as Account[];

  const onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log();
  };
  return (
    <div style={{textAlign: "center"  }}>
      <form onSubmit={onSubmitHandler}>
        <label htmlFor="select">Account From:</label>
        <select id="accountfrom" name="accountfrom" required>
          {accounts.map(({ id }) => {
            return <option key={id}>{id}</option>;
          })}
        </select>
        <br/>
        <label htmlFor="select">Currency:</label>
        <select id="currency" name="currency" required>
          <option value="URU"> $ (URU)</option>
          <option value="USD">U$S (USD)</option>
          <option value="EU">EUR (EU)</option>
        </select>
        <br/>
        <Input required type="number" label="Amount" />
        <Button type="submit" buttonLabel="Confirm" />
      </form>
    </div>
  );
}
export default NewTransferPage;
