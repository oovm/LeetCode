export class Solution {
    colorTheGrid(m: number, n: number): number {
        const MOD = 1000000007;
        const states: number[][] = [];
        const walk = (pos: number, prev: number, cur: number[]): void => {
            if (pos === m) {
                states.push([...cur]);
                return;
            }
            for (let c = 0; c < 3; c++) {
                if (c !== prev) {
                    walk(pos + 1, c, [...cur, c]);
                }
            }
        };
        walk(0, -1, []);
        const compat = states.map((a) => states.filter((b) => a.every((v, i) => v !== b[i])));
        let dp = new Array<number>(states.length).fill(1);
        for (let col = 1; col < n; col++) {
            const next = new Array<number>(states.length).fill(0);
            for (let s = 0; s < states.length; s++) {
                for (const p of compat[s]) {
                    next[s] = (next[s] + dp[p]) % MOD;
                }
            }
            dp = next;
        }
        return dp.reduce((a, b) => (a + b) % MOD, 0);
    }
}
