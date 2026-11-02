export class Solution {
    isMonotonic(nums: number[]): boolean {
        let inc = true;
        let dec = true;
        for (let i = 0; i + 1 < nums.length; i += 1) {
            if (nums[i] < nums[i + 1]) {
                dec = false;
            }
            if (nums[i] > nums[i + 1]) {
                inc = false;
            }
        }
        return inc || dec;
    }
}
