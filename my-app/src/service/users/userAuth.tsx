import axios from "axios";
import { axiosClient } from "..";
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
    return error;
  }
}
export async function login(data: userData) {
  try {
    console.log("running login")
    // const response: any = await axios.post("bank_api/api/users/login", { ...data});
    // console.log(response)
    // localStorage.setItem("token", response.data.data.token);
    // const expiration = new Date();
    // expiration.setTime(response.data.data.expiresIn);
    // /*expiration.setTime(
    //   response.data.data.tokenExpiration - 4 * 60 * 60 * 1000 + 1 * 30 * 1000
    // );*/
    // localStorage.setItem("tokenExpiration", expiration.toISOString());
    // return response.data.data;
    const response = await axiosClient.post("/users/login", data);
    localStorage.setItem("token", response.data.data.token);
    const expiration = new Date();
    expiration.setTime(response.data.data.tokenExpiration);
    /*expiration.setTime(
      response.data.data.tokenExpiration - 4 * 60 * 60 * 1000 + 1 * 30 * 1000
    );*/
    localStorage.setItem("tokenExpiration", expiration.toISOString());
    return response.data.data;
  } catch (error) {
    return error;
  }
}
export async function getLoggedUser() {
  try {
    const response = await axiosClient.get("/users/me");
    return response.data.data;
  } catch (error) {
    return error;
  }
}
