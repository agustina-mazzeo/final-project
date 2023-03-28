import axios from "axios";
import { axiosClient } from ".";
import { Params } from "../utils/types";

export async function getTransactions(params:Params) {
  try {
    const response = await axiosClient.get("/transactions", {params:params});
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response!.data.errors[0] };
    } else {
      return { error: "An unexpected error occurred" };
    }
  }
}
