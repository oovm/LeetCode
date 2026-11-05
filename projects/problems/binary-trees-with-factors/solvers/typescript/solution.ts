export class Solution {
    numFactoredBinaryTrees(arr: any[]): number {
        const modulus = 1000000007n;
        const ordered = arr.map((value) => BigInt(value));
        ordered.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
        const n = ordered.length;
        const positions = new Map<bigint, number>();
        for (let index = 0; index < n; index++) {
            positions.set(ordered[index], index);
        }
        const dp = new Array<bigint>(n).fill(1n);
        for (let right = 0; right < n; right++) {
            const value = ordered[right];
            for (let left = 0; left < right; left++) {
                const factor = ordered[left];
                if (value % factor !== 0n) {
                    continue;
                }
                const other = value / factor;
                const slot = positions.get(other);
                if (slot !== undefined) {
                    dp[right] = (dp[right] + dp[left] * dp[slot]) % modulus;
                }
            }
        }
        let total = 0n;
        for (const value of dp) {
            total = (total + value) % modulus;
        }
        return Number(total);
    }
}
