import axios from "axios";

const baseURL = "https://decemberbank.inhouse.decemberlabs.com/api";

export const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (axios.isAxiosError(error)) {
      return Promise.reject({ error: error.response?.data.errors[0] ?? error.message });
    } else {
      return Promise.reject({ error });
    }
  }
);

export function setAuthorizationToken(token: string) {
  if (token) {
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosClient.defaults.headers.common["Authorization"];
  }
}
