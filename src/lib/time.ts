import type { currencyStamp } from "./currency";

export const convertUnixToDate = (stamp: number): Date => {
    return new Date(stamp * 1000);
}

export const getTimeDifference = ({ currentStamp }: { currentStamp: currencyStamp | null }): string => {
    const stampDate = convertUnixToDate(currentStamp?.unixStamp ?? 0);
    const currentDate = Date.now();
    const dateDifference = Math.abs(currentDate - stampDate.getTime());
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
    return updateDateRender;
}
