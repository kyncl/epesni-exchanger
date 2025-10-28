import { useEffect, useState, type ChangeEvent } from 'react';
import '../style/App.css';
import { timeInfoUpdate } from '../lib/time';
import { CurrencyDropdown } from './CurrencyDropdown';
import { getSavedRates } from '../lib/localStorage';
import { CurrencyStamp } from '../lib/currency/CurrencyStamp';
import type { Rate } from '../lib/currency/Rate';
import { fromCurrencyHandle, toCurrencyHandle } from '../lib/currency/handlers';
import { fetchCurrencies } from '../lib/currency/fetchCurrencies';

const currencyApi = import.meta.env.VITE_CURRENCY_EXCHANGE_API;
const defaultCurrency = "EUR";

function App() {
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [timeInfo, setTimeInfo] = useState(<></>);

    const [currentStamp, setCurrentStamp] = useState<CurrencyStamp | null>(null);
    const [result, setResult] = useState<number | null>(null);
    const [amount, setAmount] = useState<number | null>(null);
    const [fromCurrency, setFromCurrency] = useState<Rate | null>(null);
    const [toCurrency, setToCurrency] = useState<Rate | null>(null);

    /** Probably it can be only on one fetch and then do some math, but I'm too lazy */
    const getNewStamp = async ({ newFromCurrency }: { newFromCurrency: string }) => {
        const fetch = await fetchCurrencies({ url: `${currencyApi}${newFromCurrency}` });
        if (fetch)
            setCurrentStamp(fetch)
    };
    const userAmoutInputHandle = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!value || isNaN(value)) {
            setResult(null);
            return;
        }
        setAmount(value);
    };

    useEffect(() => {
        const fetching = async () => {
            const newStamp = await fetchCurrencies({ url: `${currencyApi}${defaultCurrency}` });
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
    }, []);

    useEffect(() => {
        setTimeInfo(timeInfoUpdate({ currentStamp }))
    }, [currentStamp]);

    useEffect(() => {
        if (!currentStamp)
            return;

        // rates[0] should be the default currency 
        // or the from currency
        setFromCurrency(currentStamp.rates[0]);
        if (isFirstLoad) {
            setToCurrency(currentStamp.rates[0]);
            setIsFirstLoad(false);
        }
        const possibleNewToCurrency = currentStamp.rates.find(rate => rate.currencyName === toCurrency?.currencyName);
        if (possibleNewToCurrency)
            setToCurrency(possibleNewToCurrency);
    }, [currentStamp])

    useEffect(() => {
        if (amount && toCurrency) {
            const roundedResStr = (amount * toCurrency.amount).toFixed(2);
            setResult(parseFloat(roundedResStr));
        }
    }, [amount, fromCurrency, toCurrency]);

    return (
        <div className='jetbrains'>
            <h1 className='text-3xl md:text-4xl text-center p-5'>Epesni exchanger</h1>
            <div className='h-[75vh] flex-col flex justify-center items-center'>
                <div className='flex md:justify-center items-center'>
                    <input
                        onChange={userAmoutInputHandle}
                        type='text'
                        name='amount'
                        autoFocus={true}
                        className='border-2 rounded-xl 
                        w-full md:w-fit pl-3
                    border-black text-2xl md:text-4xl'
                    />
                    <CurrencyDropdown
                        dropDownName='fromCurrency'
                        currentStamp={currentStamp}
                        onChangeHandle={(e: ChangeEvent<HTMLSelectElement>) => {
                            setFromCurrency(fromCurrencyHandle({ e, getNewStamp }));
                        }}
                    />
                </div>
                <div className='flex flex-col md:flex-row justify-center items-center m-5'>
                    <h2 className='text-xl md:text-4xl 
                    md:mr-5 font-bold'
                    >{result?.toFixed(2)}</h2>
                    <CurrencyDropdown
                        dropDownName='toCurrency'
                        currentStamp={currentStamp}
                        onChangeHandle={(e: ChangeEvent<HTMLSelectElement>) => {
                            setToCurrency(toCurrencyHandle(e))
                        }}
                    />
                </div>
                <p className='text-lg md:text-xl 
                font-light text-center'
                >{!result ? "Write number please :3" : ""}</p>
            </div>
            <div className='absolute 
            bottom-5 w-full md:left-1/2 md:-translate-x-1/2'
            >
                {timeInfo}
            </div>
        </div>
    )
}

export default App
