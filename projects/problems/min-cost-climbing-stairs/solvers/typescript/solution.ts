export class Solution {
    minCostClimbingStairs(cost: number[]): number {
        let f1 = 0;
        let f2 = 0;
        for (const c of cost) {
            [f1, f2] = [f2, Math.min(f1, f2) + c];
        }
        return Math.min(f1, f2);
    }
}
