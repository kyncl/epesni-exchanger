import { CurrencyStamp } from "./CurrencyStamp";

export const fetchCurrencies = async ({ url }: { url: string }): Promise<CurrencyStamp | null> => {
    let response = null;
    try {
        response = await fetch(url);
    }
    catch {
        return null;
    }
    if (!response.ok)
        return null;

    const data = await response.json();
    const rates = data.rates;
    const newCurrencyStamp = CurrencyStamp.safeParse({
        unixStamp: data.time_last_update_unix,
        rates: rates
    });
    if (newCurrencyStamp.success)
        return newCurrencyStamp.data;
    return null;
};


