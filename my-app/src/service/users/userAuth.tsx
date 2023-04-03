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
    const response = await axiosClient.post("/users/login", data);
    localStorage.setItem("token", response.data.data.token);
    const expiration = new Date();
    expiration.setTime(response.data.data.tokenExpiration);
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

