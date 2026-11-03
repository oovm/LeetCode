export class Solution {
    removeDuplicates(nums: number[]): number {
        let write = 0;
        for (const x of nums) {
            if (write < 2 || nums[write - 2] !== x) nums[write++] = x;
        }
        return write;
    }
}
