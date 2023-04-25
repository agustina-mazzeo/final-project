import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();
const APIKEY = process.env.APIKEY as string;
const baseURL = 'https://api.apilayer.com/fixer';

export const axiosClient = axios.create({
  baseURL,
  headers: {
    apikey: APIKEY,
  },
});
axiosClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (axios.isAxiosError(error)) {
      return Promise.reject({ error: error.message });
    } else {
      return Promise.reject({ error });
    }
  },
);
