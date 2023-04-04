import { Rates } from "./types";

export function numWithCommas(num: number): string {
    return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }

export function numWithoutCommas(numWithCommas:string) : number{
    return parseFloat(numWithCommas.replaceAll(",", ""))
}


export const getExchangeRate = (
  currency_from: string,
  wanted_currency: string,
  rates: Rates
) => {
  let exchangeRate = 1;
  switch (currency_from) {
    case "URU":
      if (wanted_currency === "USD") exchangeRate = rates.usd;
      else if ((wanted_currency === "EU")) exchangeRate = rates.eu;
      break;
    case "USD":
      if (wanted_currency === "URU") exchangeRate = 1 / rates.usd;
      else if ((wanted_currency === "EU")) exchangeRate = rates.eu / rates.usd;
      break;
    case "EU":
      if (wanted_currency === "USD") exchangeRate = rates.usd / rates.eu;
      else if (wanted_currency === "URU") exchangeRate = 1 / rates.eu;
  }
  return exchangeRate;
};
