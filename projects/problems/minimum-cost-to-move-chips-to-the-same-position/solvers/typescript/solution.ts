export class Solution {
    minCostToMoveChips(position: number[]): number {
        let even = 0;
        let odd = 0;
        for (const p of position) {
            if (p % 2 === 0) even++;
            else odd++;
        }
        return Math.min(even, odd);
    }
}
