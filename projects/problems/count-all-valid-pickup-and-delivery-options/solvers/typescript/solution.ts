export class Solution {
    countOrders(n: number): number {
        const MOD = 1000000007n;
        let result = 1n;
        for (let i = 2n; i <= BigInt(n); i++) {
            result = (result * i) % MOD;
            result = (result * (2n * i - 1n)) % MOD;
        }
        return Number(result);
    }
}
