import type { ChangeEvent } from "react";

export interface currencyStamp {
    unixStamp: number,
    rates: Rate[]
};

export interface Rate {
    currencyName: string,
    amount: number,
}

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
export const fromCurrencyHandle = ({ e, getNewStamp }: {
    e: ChangeEvent<HTMLSelectElement>,
    getNewStamp: ({ newFromCurrency }: {
        newFromCurrency: string;
    }) => Promise<void>
}): Rate | null => {
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
