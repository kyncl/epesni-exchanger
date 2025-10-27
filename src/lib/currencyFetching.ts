import type { currencyStamp, Rate } from "./currency";

export const fetchCurrencies = async ({ url }: { url: string }): Promise<currencyStamp | null> => {
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
        newRates.push({
            currencyName: key,
            amount: newAmount,
        });
    }

    return {
        unixStamp: data.time_last_update_unix,
        rates: newRates
    };
};


