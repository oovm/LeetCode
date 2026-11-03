export class Solution {
    longestCommonSubsequence(text1: string, text2: string): number {
        const n = text2.length;
        let prev = new Array<number>(n + 1).fill(0);
        for (let i = 1; i <= text1.length; i++) {
            const cur = new Array<number>(n + 1).fill(0);
            for (let j = 1; j <= n; j++) {
                cur[j] =
                    text1[i - 1] === text2[j - 1]
                        ? prev[j - 1] + 1
                        : Math.max(prev[j], cur[j - 1]);
            }
            prev = cur;
        }
        return prev[n];
    }
}
