export class Solution {
    selfDivisiblePermutationCount(n: number): number {
        const states = 1 << n;
        const dp = new Array<number>(states).fill(0);
        dp[0] = 1;
        for (let mask = 0; mask < states; mask++) {
            const position = popcount(mask) + 1;
            if (position > n) {
                continue;
            }
            for (let value = 1; value <= n; value++) {
                const bit = 1 << (value - 1);
                if ((mask & bit) !== 0 || gcd(position, value) !== 1) {
                    continue;
                }
                dp[mask | bit] = (dp[mask | bit] as number) + (dp[mask] as number);
            }
        }
        return dp[states - 1] as number;
    }
}

function popcount(value: number): number {
    let count = 0;
    let rest = value;
    while (rest > 0) {
        count += rest & 1;
        rest >>= 1;
    }
    return count;
}

function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}
