import type { CurrencyStamp } from "./currency/CurrencyStamp";

export const convertUnixToDate = (stamp: number): Date => {
    return new Date(stamp * 1000);
}

export const getTimeDifference = ({ currentStamp }: { currentStamp: (CurrencyStamp) | null }): string => {
    const stampDate = convertUnixToDate(currentStamp?.unixStamp ?? 0);
    const currentDate = Date.now();
    const dateDifference = Math.abs(currentDate - stampDate.getTime());

    const updateDateRender = new Intl.RelativeTimeFormat("cs-CZ", { style: "short" });

    const seconds = Math.abs(Math.floor(dateDifference / 1000));
    const minutes = Math.abs(Math.floor(seconds / 60));
    const hours = Math.abs(Math.floor(minutes / 60));
    const days = Math.abs(Math.floor(hours / 24));
    const months = Math.abs(Math.floor(days / 30));
    const years = Math.abs(Math.floor(days / 365));

    if (years > 0)
        return updateDateRender.format(-years, "year");
    else if (months > 0)
        return updateDateRender.format(-months, "month");
    else if (days > 0)
        return updateDateRender.format(-days, "day");
    else if (hours > 0)
        return updateDateRender.format(-hours, "hour");
    else if (minutes > 0)
        return updateDateRender.format(-minutes, "minute");
    else
        return updateDateRender.format(-seconds, "second");

}

export const timeInfoUpdate = ({ currentStamp }: { currentStamp: CurrencyStamp | null }) => {
    const stampDate = convertUnixToDate(currentStamp?.unixStamp ?? 0);
    const lastUpdateDateStr = `${stampDate.toLocaleDateString("cs-CZ")} ${stampDate.toLocaleTimeString("cs-CZ")}`;
    const diffNowLastUpdateStr = getTimeDifference({ currentStamp: currentStamp });
    return (
        <div className='flex justify-center flex-col items-center' >
            <p>{lastUpdateDateStr} </p>
            <p>({diffNowLastUpdateStr})</p>
        </div>
    );
} 
