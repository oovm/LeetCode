export class Solution {
    dayOfTheWeek(day: number, month: number, year: number): string {
        const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return names[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
    }
}
