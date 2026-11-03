export class Solution {
    numberOfCombinations(num: string): number {
        const MOD = 1000000007;
        const n = num.length;
        if (num[0] === '0') return 0;
        const lcp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(0));
        for (let i = n - 1; i >= 0; i--) {
            for (let j = n - 1; j >= 0; j--) {
                lcp[i][j] = num[i] === num[j] ? lcp[i + 1][j + 1] + 1 : 0;
            }
        }
        const f: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
        const colPre: number[][] = Array.from({ length: n }, () => new Array<number>(n + 1).fill(0));
        for (let j = 0; j < n; j++) {
            for (let i = j; i >= 0; i--) {
                if (num[i] === '0') continue;
                if (i === 0) {
                    f[i][j] = 1;
                    continue;
                }
                const len = j - i + 1;
                const lo = Math.max(0, i - len + 1);
                let sum = (colPre[i - 1][i] - colPre[i - 1][lo] + MOD) % MOD;
                const p0 = i - len;
                if (p0 >= 0) {
                    const common = lcp[p0][i];
                    if (common >= len || num[p0 + common] < num[i + common]) {
                        sum = (sum + f[p0][i - 1]) % MOD;
                    }
                }
                f[i][j] = sum;
            }
            for (let i = 0; i < n; i++) {
                colPre[j][i + 1] = (colPre[j][i] + f[i][j]) % MOD;
            }
        }
        return colPre[n - 1][n];
    }
}
