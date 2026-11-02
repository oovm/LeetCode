export class Solution {
    daysBetweenDates(date1: string, date2: string): number {
        const isLeap = (year: number): boolean => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        const daysInMonth = (year: number, month: number): number => {
            if (month === 2) {
                return isLeap(year) ? 29 : 28;
            }
            return [4, 6, 9, 11].includes(month) ? 30 : 31;
        };
        const calcDays = (date: string): number => {
            const year = Number(date.slice(0, 4));
            const month = Number(date.slice(5, 7));
            const day = Number(date.slice(8, 10));
            let days = day;
            for (let y = 1971; y < year; y++) {
                days += 365 + (isLeap(y) ? 1 : 0);
            }
            for (let m = 1; m < month; m++) {
                days += daysInMonth(year, m);
            }
            return days;
        };
        return Math.abs(calcDays(date1) - calcDays(date2));
    }
}
