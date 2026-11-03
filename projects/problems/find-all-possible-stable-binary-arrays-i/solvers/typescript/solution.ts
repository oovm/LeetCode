export class Solution {
    numberOfStableArrays(zero: number, one: number, limit: number): number {
        const MOD = 1000000007;
        const dp0 = Array.from({ length: zero + 1 }, () => new Array<number>(one + 1).fill(0));
        const dp1 = Array.from({ length: zero + 1 }, () => new Array<number>(one + 1).fill(0));
        for (let i = 1; i <= Math.min(zero, limit); i++) {
            dp0[i]![0] = 1;
        }
        for (let j = 1; j <= Math.min(one, limit); j++) {
            dp1[0]![j] = 1;
        }
        for (let i = 1; i <= zero; i++) {
            for (let j = 1; j <= one; j++) {
                const over0 = i - limit >= 1 ? (dp0[i - limit - 1]![j] as number) : 0;
                const over1 = j - limit >= 1 ? (dp1[i]![j - limit - 1] as number) : 0;
                dp0[i]![j] = ((dp0[i - 1]![j] as number) + (dp1[i - 1]![j] as number) - over0 + MOD) % MOD;
                dp1[i]![j] = ((dp1[i]![j - 1] as number) + (dp0[i]![j - 1] as number) - over1 + MOD) % MOD;
            }
        }
        return ((dp0[zero]![one] as number) + (dp1[zero]![one] as number)) % MOD;
    }
}
