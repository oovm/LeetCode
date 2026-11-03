export class Solution {
    rob(nums: number[]): number {
        if (nums.length === 1) return nums[0];
        const robRange = (arr: number[]) => {
            let take = 0;
            let skip = 0;
            for (const x of arr) [take, skip] = [skip + x, Math.max(skip, take)];
            return Math.max(take, skip);
        };
        return Math.max(robRange(nums.slice(0, -1)), robRange(nums.slice(1)));
    }
}
