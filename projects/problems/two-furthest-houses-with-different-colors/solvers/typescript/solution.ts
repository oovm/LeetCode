export class Solution {
    maxDistance(colors: number[]): number {
        const n = colors.length;
        let best = 0;
        for (let i = 0; i < n; i++) {
            if (colors[i] !== colors[0]) best = Math.max(best, i);
            if (colors[i] !== colors[n - 1]) best = Math.max(best, n - 1 - i);
        }
        return best;
    }
}
