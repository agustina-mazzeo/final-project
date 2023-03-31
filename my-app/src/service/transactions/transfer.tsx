import axios from "axios";
import { axiosClient } from "..";
import { Params } from "../../utils/types";

export async function getRates() {
  try {
    const response = await axiosClient.get("/transactions/rates");
    return response.data;
  } catch (error) {
    return error
  }
}
