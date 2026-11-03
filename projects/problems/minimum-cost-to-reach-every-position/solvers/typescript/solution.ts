export class Solution {
    minCosts(cost: number[]): number[] {
        let best = Infinity;
        return cost.map((c) => (best = Math.min(best, c)));
    }
}
