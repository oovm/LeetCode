export class Solution {
    minimumCost(cost: number[]): number {
        const sorted = [...cost].sort((a, b) => b - a);
        let total = 0;
        for (let i = 0; i < sorted.length; i++) {
            if (i % 3 !== 2) total += sorted[i];
        }
        return total;
    }
}
