export class Solution {
    countCompleteDayPairs(hours: number[]): number {
        const rem = new Array<number>(24).fill(0);
        let count = 0;
        for (const h of hours) {
            count += rem[(24 - (h % 24)) % 24];
            rem[h % 24]++;
        }
        return count;
    }
}
