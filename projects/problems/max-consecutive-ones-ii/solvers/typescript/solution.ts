export class Solution {
    findMaxConsecutiveOnes(nums: number[]): number {
        let best = 0;
        let left = 0;
        let zeros = 0;
        for (let right = 0; right < nums.length; right++) {
            if (nums[right] === 0) zeros++;
            while (zeros > 1) if (nums[left++] === 0) zeros--;
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}
