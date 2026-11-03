export class Solution {
    closestTarget(words: string[], target: string, startIndex: number): number {
        const n = words.length;
        let best = Infinity;
        for (let i = 0; i < n; i++) {
            if (words[i] === target) {
                const d = Math.abs(i - startIndex);
                best = Math.min(best, d, n - d);
            }
        }
        return best === Infinity ? -1 : best;
    }
}
