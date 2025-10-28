import type { ChangeEvent } from "react";
import type { CurrencyStamp } from "../lib/currency/CurrencyStamp";

type CurrencyDropdownProps = {
    dropDownName: string,
    currentStamp: (CurrencyStamp) | null,
    onChangeHandle: (e: ChangeEvent<HTMLSelectElement>) => void
}

export const CurrencyDropdown = ({ dropDownName, currentStamp, onChangeHandle }:
    CurrencyDropdownProps
) => {
    return (
        <select name={dropDownName}
            className='ml-3 text-xl md:text-2xl  text-center'
            onChange={onChangeHandle}>
            {currentStamp?.rates.map((currency) =>
                <option
                    key={currency.currencyName}
                    value={`${currency.currencyName}-${currency.amount}`}
                    className="bg-white text-black dark:bg-zinc-900 dark:text-white"
                >
                    {currency.currencyName}
                </option>
            )}
        </select>
    )
};
