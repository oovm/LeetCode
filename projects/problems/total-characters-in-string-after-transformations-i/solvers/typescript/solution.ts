export class Solution {
    lengthAfterTransformations(s: string, t: number): number {
        const MOD = 1000000007;
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) counts[ch.charCodeAt(0) - 97] += 1;
        for (let round = 0; round < t; round++) {
            const next = new Array<number>(26).fill(0);
            for (let c = 0; c < 25; c++) {
                next[c + 1] = counts[c];
            }
            next[0] = counts[25];
            next[1] = (next[1] + counts[25]) % MOD;
            counts.splice(0, 26, ...next);
        }
        return counts.reduce((a, b) => (a + b) % MOD, 0);
    }
}
