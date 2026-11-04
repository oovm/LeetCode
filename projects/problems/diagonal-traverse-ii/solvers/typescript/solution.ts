export class Solution {
    findDiagonalOrder(nums: number[][]): number[][] {
        const buckets: number[][] = [];
        for (let r = 0; r < nums.length; r++) {
            for (let c = 0; c < nums[r].length; c++) {
                const key = r + c;
                if (!buckets[key]) buckets[key] = [];
                buckets[key].push(nums[r][c]);
            }
        }
        return buckets.filter((bucket) => bucket.length > 0);
    }
}
