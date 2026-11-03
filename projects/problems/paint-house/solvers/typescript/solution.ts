export class Solution {
    minCost(costs: number[][]): number {
        let prev = [0, 0, 0];
        for (const [r, g, b] of costs) {
            prev = [
                r + Math.min(prev[1], prev[2]),
                g + Math.min(prev[0], prev[2]),
                b + Math.min(prev[0], prev[1]),
            ];
        }
        return Math.min(...prev);
    }
}
