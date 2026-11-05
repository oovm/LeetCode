export class Solution {
    flipgame(fronts: number[], backs: number[]): number {
        const blocked = new Set<number>();
        for (let i = 0; i < fronts.length; i++) {
            if (fronts[i] === backs[i]) {
                blocked.add(fronts[i]);
            }
        }
        let best = Number.POSITIVE_INFINITY;
        for (let i = 0; i < fronts.length; i++) {
            if (!blocked.has(fronts[i])) {
                best = Math.min(best, fronts[i]);
            }
            if (!blocked.has(backs[i])) {
                best = Math.min(best, backs[i]);
            }
        }
        return best === Number.POSITIVE_INFINITY ? 0 : best;
    }
}
