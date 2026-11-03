export class Solution {
    minimumCost(sentence: string, k: number): number | string {
        const words = sentence.split(' ');
        const n = words.length;
        const lens = words.map((w) => w.length);
        const dp = new Array<number>(n + 1).fill(Infinity);
        dp[n] = 0;
        for (let i = n - 1; i >= 0; i--) {
            let width = 0;
            for (let j = i; j < n; j++) {
                width += lens[j] + (j > i ? 1 : 0);
                if (width > k) break;
                const tail = j === n - 1 ? 0 : (k - width) ** 2;
                dp[i] = Math.min(dp[i], tail + dp[j + 1]);
            }
        }
        const result = dp[0];
        return Number.isSafeInteger(result) ? result : String(result);
    }
}
