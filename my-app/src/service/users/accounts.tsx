import { axiosClient } from "..";

export async function getAccounts() {
  try {
    const response = await axiosClient.get("/accounts");
    return response.data;
  } catch (error) {
    return error;
  }
}
