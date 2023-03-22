import axios from "axios";
import { axiosClient } from ".";

export async function getAccounts() {
  try {
    const response = await axiosClient.get("/accounts");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response!.data.errors[0] };
    } else {
      return { error: "An unexpected error occurred" };
    }
  }
}
