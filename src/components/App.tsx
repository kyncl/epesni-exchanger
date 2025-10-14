import { useEffect, useState, type ChangeEvent } from 'react';
import '../style/App.css';
import { fetchCurrencies } from '../lib/currencyFetching';
import type { currencyStamp, Rate } from '../lib/currency';
import { convertUnixToDate, getTimeDifference } from '../lib/time';
import { CurrencyDropdown } from './CurrencyDropdown';

const currencyApi = import.meta.env.VITE_CURRENCY_EXCHANGE_API;


function App() {
    const defaultCurrency = "EUR";
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const [currentStamp, setCurrentStamp] = useState<currencyStamp | null>(null);

    const [timeInfo, setTimeInfo] = useState(<></>);

    const [result, setResult] = useState<number | null>(null);
    const [amout, setAmount] = useState<number | null>(null);
    const [fromCurrency, setFromCurrency] = useState<Rate | null>();
    const [toCurrency, setToCurrency] = useState<Rate | null>(null);

    useEffect(() => {
        const fetching = async () => {
            const newStamp = await fetchCurrencies({ url: `${currencyApi}${defaultCurrency}` });
            if (newStamp)
                setCurrentStamp(newStamp);
        }
        fetching();
    }, []);

    // time info handle
    useEffect(() => {
        const stampDate = convertUnixToDate(currentStamp?.unixStamp ?? 0);
        const lastUpdateDateStr = `${stampDate.toLocaleDateString("cs-CZ")} ${stampDate.toLocaleTimeString("cs-CZ")}`;
        const diffNowLastUpdateStr = getTimeDifference({ currentStamp: currentStamp });
        setTimeInfo(
            <div className='flex justify-center flex-col items-center'>
                <p>{lastUpdateDateStr}</p>
                <p>({diffNowLastUpdateStr})</p>
            </div>)
    }, [currentStamp]);

    useEffect(() => {
        if (currentStamp) {
            setFromCurrency(currentStamp.rates[0]);
            if (isFirstLoad) {
                setToCurrency(currentStamp.rates[0]);
                setIsFirstLoad(false);
            }
            const possibleNewToCurrency = currentStamp.rates.find(rate => rate.currencyName == toCurrency?.currencyName);
            if (possibleNewToCurrency)
                setToCurrency(possibleNewToCurrency);
        }
    }, [currentStamp])

    const getNewToCurrency = async ({ newToCurrency }: { newToCurrency: string }) => {
        const newStamp = await fetchCurrencies({ url: `${currencyApi}${newToCurrency}` });
        if (newStamp)
            setCurrentStamp(newStamp)
    };

    useEffect(() => {
        if (amout && toCurrency) {
            setResult(amout * toCurrency.amount);
        }
    }, [amout, fromCurrency, toCurrency]);

    const toCurrencyHandle = (e: ChangeEvent<HTMLSelectElement>) => {
        const possibleRate = e.target.value.split("-");
        if (possibleRate.length == 2) {
            setToCurrency({
                currencyName: possibleRate[0],
                amount: parseFloat(possibleRate[1] ?? 0),
            })
        }
    }
    const fromCurrencyHandle = (e: ChangeEvent<HTMLSelectElement>) => {
        const possibleRate = e.target.value.split("-");
        if (possibleRate.length == 2) {
            setFromCurrency({
                currencyName: possibleRate[0],
                amount: parseFloat(possibleRate[1] ?? 0),
            })
            getNewToCurrency({ newToCurrency: possibleRate[0] });
        }
    }


    return (
        <div className='jetbrains'>
            <h1 className='text-3xl md:text-4xl text-center p-5'>Epseni exchanger</h1>
            <div className='h-[75vh] flex-col flex justify-center items-center'>
                <div className='flex md:justify-center items-center'>
                    <input
                        onChange={(e) => {
                            if (e.target.value !== ""
                                && e.target.value !== null) {
                                const value = parseFloat(e.target.value);
                                if (!isNaN(value)) {
                                    setAmount(value);
                                }
                            }
                            else {
                                setResult(null);
                            }
                        }}
                        type='text'
                        name='amount'
                        autoFocus={true}
                        className='border-2 rounded-xl 
                        w-full md:w-fit pl-3
                    border-black text-2xl md:text-4xl'
                    />
                    <CurrencyDropdown
                        currentStamp={currentStamp}
                        handle={fromCurrencyHandle}
                    />
                </div>
                <div className='flex flex-col md:flex-row justify-center items-center m-5'>
                    <h2 className='text-xl md:text-4xl 
                    md:mr-5 font-bold'
                    >{result}</h2>
                    <CurrencyDropdown
                        currentStamp={currentStamp}
                        handle={toCurrencyHandle}
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
