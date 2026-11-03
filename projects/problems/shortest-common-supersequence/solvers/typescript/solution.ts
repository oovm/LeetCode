export class Solution {
    shortestCommonSupersequence(str1: string, str2: string): string {
        const m = str1.length;
        const n = str2.length;
        const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
        for (let i = m - 1; i >= 0; i--) {
            for (let j = n - 1; j >= 0; j--) {
                dp[i][j] =
                    str1[i] === str2[j]
                        ? dp[i + 1][j + 1] + 1
                        : Math.max(dp[i + 1][j], dp[i][j + 1]);
            }
        }
        const out: string[] = [];
        let i = 0;
        let j = 0;
        while (i < m && j < n) {
            if (str1[i] === str2[j]) {
                out.push(str1[i]);
                i += 1;
                j += 1;
            } else if (dp[i + 1][j] >= dp[i][j + 1]) {
                out.push(str1[i]);
                i += 1;
            } else {
                out.push(str2[j]);
                j += 1;
            }
        }
        return out.join('') + str1.slice(i) + str2.slice(j);
    }
}
