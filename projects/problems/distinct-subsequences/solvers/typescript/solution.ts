export class Solution {
    numDistinct(s: string, t: string): number | string {
        const m = s.length;
        const n = t.length;
        let prev = new Array<bigint>(n + 1).fill(0n);
        prev[0] = 1n;
        for (let i = 1; i <= m; i++) {
            const cur = [...prev];
            for (let j = 1; j <= n; j++) {
                if (s[i - 1] === t[j - 1]) {
                    cur[j] = prev[j] + prev[j - 1];
                }
            }
            prev = cur;
        }
        return prev[n] <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(prev[n]) : prev[n].toString();
    }
}
