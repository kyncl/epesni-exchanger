import { CurrencyStamp } from "./currency/CurrencyStamp";

export const getSavedRates = (): CurrencyStamp | null => {
    const savedStamp = localStorage.getItem("savedCurrencyStamp");
    if (!savedStamp)
        return null;
    try {
        const possibleStamp = CurrencyStamp.safeParse(
            JSON.parse(savedStamp)
        );
        if (possibleStamp.success)
            return possibleStamp.data;
    }
    catch { }
    return null;
}
