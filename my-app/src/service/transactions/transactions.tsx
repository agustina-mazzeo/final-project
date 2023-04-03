import { axiosClient } from "..";
import { Params } from "../../utils/types";



export async function getTransactions(params: Params) {
  try {
    const response = await axiosClient.get("/transactions", { params });
    return response.data;
  } catch (error) {
    return error;
  }
}

