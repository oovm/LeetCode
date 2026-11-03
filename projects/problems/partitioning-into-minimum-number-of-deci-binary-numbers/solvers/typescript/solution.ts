export class Solution {
    minPartitions(n: string): number {
        let best = 0;
        for (const ch of n) {
            best = Math.max(best, ch.charCodeAt(0) - 48);
        }
        return best;
    }
}
