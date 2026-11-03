export class Solution {
    numWays(n: number, k: number): number | string {
        if (n === 1) {
            return k;
        }
        let prev2 = BigInt(k);
        let prev1 = BigInt(k) * BigInt(k);
        for (let i = 3; i <= n; i++) {
            [prev2, prev1] = [prev1, (prev1 + prev2) * BigInt(k - 1)];
        }
        return prev1 <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(prev1) : prev1.toString();
    }
}
