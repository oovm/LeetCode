export class Solution {
    countTexts(pressedKeys: string): number {
        const MOD = 1000000007;
        let total = 1;
        let i = 0;
        while (i < pressedKeys.length) {
            let j = i;
            while (j < pressedKeys.length && pressedKeys[j] === pressedKeys[i]) j += 1;
            const len = j - i;
            const cap = pressedKeys[i] === '7' || pressedKeys[i] === '9' ? 4 : 3;
            const dp = new Array<number>(len + 1).fill(0);
            dp[0] = 1;
            for (let p = 1; p <= len; p++) {
                for (let take = 1; take <= Math.min(cap, p); take++) {
                    dp[p] = (dp[p] + dp[p - take]) % MOD;
                }
            }
            total = (total * dp[len]) % MOD;
            i = j;
        }
        return total;
    }
}
