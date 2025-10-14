import { useEffect, useState } from 'react';
import '../style/App.css';

const currencyApi = import.meta.env.VITE_CURRENCY_EXCHANGE_API;

interface currencyStamp {
    unixStamp: number,
    rates: Rate[]
};

interface Rate {
    currencyName: string,
    amount: number,
}

const convertUnixToDate = (stamp: number): Date => {
    return new Date(stamp * 1000);
}

function App() {
    const defaultCurrency = "EUR";
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const [currentStamp, setCurrentStamp] = useState<currencyStamp | null>(null);

    const [lastUpdateDateStr, setLastUpdateDateStr] = useState("");
    const [diffNowLastUpdateStr, setDiffNowLastUpdateStr] = useState("");

    const [result, setResult] = useState<number | null>(null);
    const [amout, setAmount] = useState<number | null>(null);
    const [fromCurrency, setFromCurrency] = useState<Rate | null>();
    const [toCurrency, setToCurrency] = useState<Rate | null>(null);


    const fetchCurrencies = async ({ url }: { url: string }) => {
        const response = await fetch(url);
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

        setCurrentStamp({
            unixStamp: data.time_last_update_unix,
            rates: newRates
        });
    };

    useEffect(() => {
        const fetching = async () => {
            await fetchCurrencies({ url: `${currencyApi}${defaultCurrency}` });
        }
        fetching();
    }, []);

    // time info handle
    useEffect(() => {
        const stampDate = convertUnixToDate(currentStamp?.unixStamp ?? 0);
        const currentDate = Date.now();
        const dateDifference = Math.abs(currentDate - stampDate.getTime());
        setLastUpdateDateStr(`${stampDate.toLocaleDateString("cs-CZ")} ${stampDate.toLocaleTimeString("cs-CZ")}`);
        let updateDateRender = "";
        const seconds = Math.floor(dateDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) {
            updateDateRender += `${days} day${days > 1 ? 's' : ''} `;
        }
        if (hours % 24 > 0) {
            updateDateRender += `${hours % 24} hour${hours % 24 > 1 ? 's' : ''} `;
        }
        if (minutes % 60 > 0) {
            updateDateRender += `${minutes % 60} minute${minutes % 60 > 1 ? 's' : ''} `;
        }
        if (seconds % 60 > 0 && days === 0 && hours === 0) { // Only show seconds if less than an hour
            updateDateRender += `${seconds % 60} second${seconds % 60 > 1 ? 's' : ''} `;
        }
        if (updateDateRender !== "") {
            updateDateRender += " ago";
        }
        setDiffNowLastUpdateStr(updateDateRender);
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

    const getNewToCurrency = ({ newToCurrency }: { newToCurrency: string }) => {
        fetchCurrencies({ url: `${currencyApi}${newToCurrency}` });
    };

    useEffect(() => {
        if (amout && toCurrency) {
            setResult(amout * toCurrency.amount);
        }
    }, [amout, fromCurrency, toCurrency]);


    return (
        <div className='jetbrains'>
            <h1 className='text-4xl text-center'>Epseni exchanger</h1>
            <input
                onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                        setAmount(value);
                    }
                }}
                type='number'
                name='amount'
                className='border border-black'
            />
            <select name='fromCurrency'
                onChange={(e) => {
                    const possibleRate = e.target.value.split("-");
                    if (possibleRate.length == 2) {
                        setFromCurrency({
                            currencyName: possibleRate[0],
                            amount: parseFloat(possibleRate[1] ?? 0),
                        })
                        getNewToCurrency({ newToCurrency: possibleRate[0] });
                    }
                }}>
                {currentStamp?.rates.map((currency) =>
                    <option key={currency.currencyName} value={`${currency.currencyName}-${currency.amount}`}>{currency.currencyName}</option>
                )}
            </select>

            <h2>{result}</h2>
            <select name='toCurrency'
                onChange={(e) => {
                    const possibleRate = e.target.value.split("-");
                    if (possibleRate.length == 2) {
                        setToCurrency({
                            currencyName: possibleRate[0],
                            amount: parseFloat(possibleRate[1] ?? 0),
                        })
                    }
                }}
            >
                {currentStamp?.rates.map((currency) =>
                    <option key={currency.currencyName} value={`${currency.currencyName}-${currency.amount}`}>{currency.currencyName}</option>
                )}
            </select>

            {currentStamp ?
                <p>Last update: {lastUpdateDateStr} ({diffNowLastUpdateStr})</p>
                : <></>
            }
        </div>
    )
}

export default App
