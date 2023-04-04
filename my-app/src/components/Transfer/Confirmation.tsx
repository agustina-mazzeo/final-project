import { useState } from "react";
import { numWithCommas } from "../../utils/auxFunctions";
import { TransferData, TransferVoucher } from "../../utils/types";
import Button from "../Shared/UI/Button";
import Modal from "../Shared/UI/Modal";
import { postTransaction } from "../../service/transactions/transfer"
import { useNavigate } from "react-router-dom";
import { ROUTE_HOME } from "../../routes/routes";

function Confirmation({
  setIsShown,
  data,
  reset,
  defaultValues,
}: {
  setIsShown: (value: boolean) => void;
  data: TransferData;
  reset: any;
  defaultValues: any;
}) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [voucher, setVoucher] = useState<TransferVoucher>();
  
  const onSend = async (data: TransferData) => {
    setIsLoading(true);
    const response = await postTransaction(data);
    setIsLoading(false);
    if (response.error) {
      //handle the error
      window.alert(response.error);
      setIsShown(false)
    } else {
      reset(defaultValues);
      setVoucher(response.data);
      setShowVoucher(true);
    }
  };
  const onClose = ()=>{
    setIsShown(false)
    navigate(ROUTE_HOME);
  }
  return (
    <Modal>
      {!showVoucher && (
        <div>
          <ul>
            <li>{`Account From: ${data.account_from}`}</li>
            <li>{`Account To: ${data.account_to}`}</li>
            <li>{`Currency: ${data.currency_name}`}</li>
            <li>{`Amount: ${numWithCommas(+data.amount)}`}</li>
            {data.description && <li>{`Description: ${data.description}`}</li>}
          </ul>
          {isLoading && <p>Sending Transfer...</p>}
          <Button
            buttonLabel="Cancel"
            onClick={() => setIsShown(false)}
            disabled={isLoading}
          />
          <Button
            buttonLabel="Send"
            onClick={() => onSend(data)}
            disabled={isLoading}
          />
        </div>
      )}
      {showVoucher && voucher && (
        <div>
          <ul>
            <li>{`Account From: ${voucher.from_account_id}`}</li>
            <li>{`Account To: ${voucher.to_account_id}`}</li>
            <li>{`Transaction ID: ${voucher.id}`}</li>
          </ul>
          <Button buttonLabel="Close" onClick={onClose} />
        </div>
      )}
    </Modal>
  );
}

export default Confirmation;
