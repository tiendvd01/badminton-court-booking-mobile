import { IPriceTable } from '@/types/common';

export function toMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

export function getTimeRange(priceTables: IPriceTable[]) {
    if (!priceTables?.length) {
        return { earliestStartTime: '08:00', latestEndTime: '22:00' }; // Default values
    }

    const allPrices = priceTables.flatMap(priceTable => priceTable.prices);
    
    if (allPrices.length === 0) {
        return { earliestStartTime: '08:00', latestEndTime: '22:00' }; // Default values
    }

    const createDate = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    const earliestStartTime = allPrices.reduce((earliest, current) => {
        const currentTime = createDate(current.start_time);
        const earliestTime = createDate(earliest);
        return currentTime < earliestTime ? current.start_time : earliest;
    }, allPrices[0].start_time);

    const latestEndTime = allPrices.reduce((latest, current) => {
        const currentTime = createDate(current.end_time);
        const latestTime = createDate(latest);
        return currentTime > latestTime ? current.end_time : latest;
    }, allPrices[0].end_time);

    return { earliestStartTime, latestEndTime };
}
