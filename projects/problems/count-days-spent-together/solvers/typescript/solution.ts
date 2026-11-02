export class Solution {
    countDaysTogether(arriveAlice: string, leaveAlice: string, arriveBob: string, leaveBob: string): number {
        const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const toDayOfYear = (date: string): number => {
            const month = Number(date.slice(0, 2));
            const day = Number(date.slice(3, 5));
            return days.slice(0, month - 1).reduce((a, b) => a + b, 0) + day;
        };
        const start = Math.max(toDayOfYear(arriveAlice), toDayOfYear(arriveBob));
        const stop = Math.min(toDayOfYear(leaveAlice), toDayOfYear(leaveBob));
        return Math.max(stop - start + 1, 0);
    }
}
