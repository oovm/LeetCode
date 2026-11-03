export class Solution {
    makeStringGood(s: string): number {
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) counts[ch.charCodeAt(0) - 97] += 1;
        const n = s.length;
        let best = n;
        for (let target = 0; target <= n; target++) {
            let ops = 0;
            for (const c of counts) {
                if (c === 0) continue;
                ops += Math.min(c, Math.abs(c - target));
            }
            best = Math.min(best, ops);
        }
        return best;
    }
}
