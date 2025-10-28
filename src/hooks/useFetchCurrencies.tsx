import { useEffect, useState } from "react";
import { currencyApi, defaultCurrency } from "../main";
import { fetchCurrencies } from "../lib/currency/fetchCurrencies";
import { getSavedRates } from "../lib/localStorage";
import type { CurrencyStamp } from "../lib/currency/CurrencyStamp";

export const useFetchCurrencies = (currency?: string) => {
    const [currentStamp, setCurrentStamp] = useState<CurrencyStamp | null>(null);
    useEffect(() => {
        const fetching = async () => {
            const newStamp = await fetchCurrencies({ url: `${currencyApi}${currency ?? defaultCurrency}` });
            if (newStamp) {
                setCurrentStamp(newStamp);
                localStorage.setItem("savedCurrencyStamp", JSON.stringify(newStamp));
            }
            else {
                const savedStamp = getSavedRates();
                setCurrentStamp(savedStamp);
            }
        }
        fetching();
    }, [currency]);
    return currentStamp;
};
