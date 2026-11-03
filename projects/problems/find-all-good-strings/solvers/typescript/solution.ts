export class Solution {
    findGoodStrings(s1: string, n: number, evil: string, s2: string): number {
        const MOD = 1000000007;
        const m = evil.length;
        const fail = new Array<number>(m).fill(0);
        for (let i = 1, j = 0; i < m; i++) {
            while (j > 0 && evil[i] !== evil[j]) j = fail[j - 1];
            if (evil[i] === evil[j]) j += 1;
            fail[i] = j;
        }
        const memo = new Map<string, number>();
        const dfs = (pos: number, state: number, tightLo: boolean, tightHi: boolean): number => {
            if (state === m) return 0;
            if (pos === n) return 1;
            const key = `${pos},${state},${tightLo},${tightHi}`;
            const hit = memo.get(key);
            if (hit !== undefined) return hit;
            const lo = tightLo ? s1.charCodeAt(pos) : 97;
            const hi = tightHi ? s2.charCodeAt(pos) : 122;
            let total = 0;
            for (let c = lo; c <= hi; c++) {
                let ns = state;
                while (ns > 0 && evil.charCodeAt(ns) !== c) ns = fail[ns - 1];
                if (evil.charCodeAt(ns) === c) ns += 1;
                total =
                    (total +
                        dfs(pos + 1, ns, tightLo && c === s1.charCodeAt(pos), tightHi && c === s2.charCodeAt(pos))) %
                    MOD;
            }
            memo.set(key, total);
            return total;
        };
        return dfs(0, 0, true, true);
    }
}
