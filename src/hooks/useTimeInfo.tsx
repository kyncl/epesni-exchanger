import { useEffect, useState } from "react";
import { timeInfoUpdate } from "../lib/time";
import type { CurrencyStamp } from "../lib/currency/CurrencyStamp";

export const useTimeInfo = (currentStamp: CurrencyStamp | null) => {
    const [timeInfo, setTimeInfo] = useState(<></>);
    useEffect(() => {
        setTimeInfo(timeInfoUpdate({ currentStamp }))
    }, [currentStamp]);
    return timeInfo;
};
