import type { currencyStamp } from "./currency"

export const getSavedRates = (): currencyStamp | null => {
    const savedStampStr = localStorage.getItem("savedCunrrencyStamp");
    const savedStamp = JSON.parse(savedStampStr ?? "") as currencyStamp;
    if (typeof savedStamp === "object")
        return savedStamp

    return null;
}
