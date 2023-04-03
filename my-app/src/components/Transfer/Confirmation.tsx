import { TransferData } from "../../utils/types";
import Button from "../Shared/UI/Button";
import Modal from "../Shared/UI/Modal";

function Confirmation({
  onClose,
  data,
  send,
  isLoading
}: {
  onClose: (value: boolean) => void;
  data: TransferData;
  send: (data: TransferData) => void;
  isLoading: boolean
}) {
  return (
    <Modal>
      <div>
        <ul>
          <li>{`Account From: ${data.account_from}`}</li>
          <li>{`Account To: ${data.account_to}`}</li>
          <li>{`Currency: ${data.currency_name}`}</li>
          <li>{`Amount: ${data.amount}`}</li>
          {data.description && <li>{`Description: ${data.description}`}</li>}
        </ul>
        {isLoading && <p>Sending Transfer...</p>}
        <Button buttonLabel="Cancel" onClick={() => onClose(false)} disabled={isLoading}/>
        <Button buttonLabel="Send" onClick={() => send(data)} disabled={isLoading}/>
      </div>
    </Modal>
  );
}

export default Confirmation;
