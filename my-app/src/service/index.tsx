import axios from "axios";

const baseURL = "https://decemberbank.inhouse.decemberlabs.com/api";

export const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function setAuthorizationToken(token: string) {
    if (token) {
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axiosClient.defaults.headers.common["Authorization"];
    }
  }
