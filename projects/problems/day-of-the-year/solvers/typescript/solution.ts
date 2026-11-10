export class Solution {
    dayOfYear(date: string): number {
        const [y, m, d] = date.split("-").map(Number);
        const leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
        const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let total = d;
        for (let i = 0; i < m - 1; i++) total += days[i];
        return total;
    }
}
