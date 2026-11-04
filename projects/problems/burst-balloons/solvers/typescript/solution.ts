export class Solution {
    maxCoins(nums: number[]): number {
        const values = [1, ...nums, 1];
        const size = values.length;
        const table: number[][] = Array.from({ length: size }, () => new Array<number>(size).fill(0));

        for (let span = 1; span <= nums.length; span++) {
            for (let start = 1; start + span <= nums.length + 1; start++) {
                const last = start + span - 1;
                for (let pivot = start; pivot <= last; pivot++) {
                    const gain =
                        table[start][pivot - 1] +
                        values[start - 1] * values[pivot] * values[last + 1] +
                        table[pivot + 1][last];
                    if (gain > table[start][last]) {
                        table[start][last] = gain;
                    }
                }
            }
        }
        return table[1][nums.length];
    }
}
