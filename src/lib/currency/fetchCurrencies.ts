import { CurrencyStamp } from "./CurrencyStamp";
import { Rate } from "./Rate";

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
    let newRates: Rate[] = []
    for (const [key, value] of Object.entries(rates)) {
        let newAmount = 0;
        if (typeof value === "number") {
            newAmount = value;
        }
        const newRate = Rate.safeParse({
            currencyName: key,
            amount: newAmount,
        })
        if (newRate.success)
            newRates.push(newRate.data);
    }
    const newCurrencyStamp = CurrencyStamp.safeParse({
        unixStamp: data.time_last_update_unix,
        rates: newRates
    });
    if (newCurrencyStamp.success)
        return newCurrencyStamp.data;
    return null;
};


