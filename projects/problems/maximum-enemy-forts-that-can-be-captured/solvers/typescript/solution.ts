export class Solution {
    captureForts(forts: number[]): number {
        let best = 0;
        let prev = -1;
        for (let i = 0; i < forts.length; i++) {
            if (forts[i] !== 0) {
                if (prev >= 0 && forts[prev] !== forts[i]) {
                    best = Math.max(best, i - prev - 1);
                }
                prev = i;
            }
        }
        return best;
    }
}
