export class Solution {
    largestVariance(s: string): number {
        const present = new Set(s);
        let best = 0;
        for (const a of present) {
            for (const b of present) {
                if (a === b) continue;
                let diff = 0;
                let diffWithB = -Infinity;
                for (const ch of s) {
                    if (ch === a) {
                        diff += 1;
                        diffWithB += 1;
                    } else if (ch === b) {
                        diff -= 1;
                        diffWithB -= 1;
                    }
                    if (diff < 0) {
                        diff = 0;
                        diffWithB = -Infinity;
                    }
                    best = Math.max(best, diffWithB);
                }
            }
        }
        return best;
    }
}
