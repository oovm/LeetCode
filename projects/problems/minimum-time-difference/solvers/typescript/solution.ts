export class Solution {
    findMinDifference(timePoints: string[]): number {
        const minutes = timePoints
            .map((t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3)))
            .sort((a, b) => a - b);
        let best = Infinity;
        for (let i = 0; i < minutes.length; i++) {
            const next = minutes[(i + 1) % minutes.length] + (i === minutes.length - 1 ? 1440 : 0);
            best = Math.min(best, next - minutes[i]);
        }
        return best;
    }
}
