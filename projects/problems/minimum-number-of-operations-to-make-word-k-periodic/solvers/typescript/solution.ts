export class Solution {
    minimumOperationsToMakeKPeriodic(k: number, word: string): number {
        const counts = new Map<string, number>();
        let best = 0;
        for (let i = 0; i + k <= word.length; i += k) {
            const seg = word.slice(i, i + k);
            const c = (counts.get(seg) ?? 0) + 1;
            counts.set(seg, c);
            best = Math.max(best, c);
        }
        return word.length / k - best;
    }
}
