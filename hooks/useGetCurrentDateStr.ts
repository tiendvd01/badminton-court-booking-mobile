import { weekdays } from '@/constants';

function useGetCurrentDateStr() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = currentDate.getFullYear();
    const weekday = weekdays[currentDate.getDay()];
    const formattedDate = `${weekdays[currentDate.getDay()]}, ${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    return {
        formattedDate,
        weekday,
        day,
        month,
        year,
    };
}

export default useGetCurrentDateStr;
