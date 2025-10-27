import type { ChangeEvent } from "react";
import type { currencyStamp } from "../lib/currency";

export const CurrencyDropdown = ({ dropDownName, currentStamp, handle }:
    {
        dropDownName: string,
        currentStamp: currencyStamp | null,
        handle: (e: ChangeEvent<HTMLSelectElement>) => void
    }) => {
    return (
        <select name={dropDownName}
            className='ml-3 text-xl md:text-2xl  text-center'
            onChange={(e) => { handle(e) }}>
            {currentStamp?.rates.map((currency) =>
                <option
                    key={currency.currencyName}
                    value={`${currency.currencyName}-${currency.amount}`}
                    className=""
                >
                    {currency.currencyName}
                </option>
            )}
        </select>
    )
};
