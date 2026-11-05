export class Solution {
    assignBikes(workers: number[][], bikes: number[][]): number {
        const n = workers.length;
        const m = bikes.length;
        const states = 1 << m;
        const infinity = 1_000_000_000;
        const dp = new Array<number>(states).fill(infinity);
        dp[0] = 0;

        for (let mask = 0; mask < states; mask += 1) {
            const current = dp[mask];
            if (current >= infinity) {
                continue;
            }
            let assigned = 0;
            for (let bit = 0; bit < m; bit += 1) {
                if ((mask & (1 << bit)) !== 0) {
                    assigned += 1;
                }
            }
            if (assigned >= n) {
                continue;
            }
            for (let bike = 0; bike < m; bike += 1) {
                const bit = 1 << bike;
                if ((mask & bit) !== 0) {
                    continue;
                }
                const distance =
                    Math.abs(workers[assigned][0] - bikes[bike][0]) +
                    Math.abs(workers[assigned][1] - bikes[bike][1]);
                const nextMask = mask | bit;
                const candidate = current + distance;
                if (candidate < dp[nextMask]) {
                    dp[nextMask] = candidate;
                }
            }
        }

        let best = infinity;
        for (let mask = 0; mask < states; mask += 1) {
            let bits = 0;
            for (let bit = 0; bit < m; bit += 1) {
                if ((mask & (1 << bit)) !== 0) {
                    bits += 1;
                }
            }
            if (bits === n && dp[mask] < best) {
                best = dp[mask];
            }
        }
        return best;
    }
}
