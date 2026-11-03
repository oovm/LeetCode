export class Solution {
    maximumPopulation(logs: number[][]): number {
        const delta = new Array(101).fill(0);
        for (const [birth, death] of logs) {
            delta[birth - 1950]++;
            delta[death - 1950]--;
        }
        let best = 0;
        let bestCount = 0;
        let cur = 0;
        for (let i = 0; i < 101; i++) {
            cur += delta[i];
            if (cur > bestCount) {
                bestCount = cur;
                best = i;
            }
        }
        return 1950 + best;
    }
}
