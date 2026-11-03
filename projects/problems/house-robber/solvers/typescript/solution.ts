export class Solution {
    rob(nums: number[]): number {
        let take = 0;
        let skip = 0;
        for (const x of nums) [take, skip] = [skip + x, Math.max(skip, take)];
        return Math.max(take, skip);
    }
}
