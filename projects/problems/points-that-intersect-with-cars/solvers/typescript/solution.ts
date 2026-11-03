export class Solution {
    numberOfPoints(nums: number[][]): number {
        const covered = new Set<number>();
        for (const [start, end] of nums) {
            for (let p = start; p <= end; p++) covered.add(p);
        }
        return covered.size;
    }
}
