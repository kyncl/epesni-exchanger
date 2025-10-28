import type { ChangeEvent } from "react";
import type { Rate } from "./Rate";

export const toCurrencyHandle = (e: ChangeEvent<HTMLSelectElement>) => {
    const possibleRate = e.target.value.split("-");
    if (possibleRate.length == 2) {
        return {
            currencyName: possibleRate[0],
            amount: parseFloat(possibleRate[1] ?? 0),
        }
    }
    return null
}

type FromCurrencyHandleProps = {
    e: ChangeEvent<HTMLSelectElement>,
    getNewStamp: (
        { newFromCurrency }: { newFromCurrency: string; }
    ) => Promise<void>
}

export const fromCurrencyHandle = ({ e, getNewStamp }:
    FromCurrencyHandleProps
): Rate | null => {
    const possibleRate = e.target.value.split("-");
    if (possibleRate.length == 2) {
        getNewStamp({ newFromCurrency: possibleRate[0] });
        return {
            currencyName: possibleRate[0],
            amount: parseFloat(possibleRate[1] ?? 0),
        }
    }
    return null
}
