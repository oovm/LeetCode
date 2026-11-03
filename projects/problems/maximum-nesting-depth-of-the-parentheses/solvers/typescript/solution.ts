export class Solution {
    maxDepth(s: string): number {
        let depth = 0;
        let best = 0;
        for (const ch of s) {
            if (ch === '(') {
                depth += 1;
                best = Math.max(best, depth);
            } else if (ch === ')') {
                depth -= 1;
            }
        }
        return best;
    }
}
