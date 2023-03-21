import axios from "axios";
import { axiosClient } from ".";

export type userData = {
  name?: string;
  email: string;
  password: string;
};

export async function signup(data: userData) {
  try {
    const response = await axiosClient.post("/users", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response!.data.errors[0] };
    } else {
      return { error: "An unexpected error occurred" };
    }
  }
}
export async function login(data: userData) {
  try {
    const response = await axiosClient.post("/users/login", data);
    localStorage.setItem("token", response.data.data.token);
    const expiration = new Date();
    expiration.setTime(
      expiration.getTime() + response.data.data.tokenExpiration
    );
    localStorage.setItem("tokenExpiration", expiration.toISOString());
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response!.data.errors[0] };
    } else {
      return { error: "An unexpected error occurred" };
    }
  }
}
