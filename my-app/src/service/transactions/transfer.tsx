import { axiosClient } from "..";
import { TransferData } from "../../utils/types";

export async function getRates() {
  try {
    const response = await axiosClient.get("/transactions/rates");
    return response.data;
  } catch (error) {
    return error;
  }
}

export async function postTransaction(data:TransferData){
  try {
    const response = await axiosClient.post("/transactions", data);
    return response.data;
  } catch (error) {
    return error;
  }
}
