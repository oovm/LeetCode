export class Solution {
    specialArray(nums: number[]): number {
        const sorted = [...nums].sort((a, b) => b - a);
        for (let x = 1; x <= sorted.length; x++) {
            if (sorted[x - 1] >= x && (x === sorted.length || sorted[x] < x)) {
                return x;
            }
        }
        return -1;
    }
}
