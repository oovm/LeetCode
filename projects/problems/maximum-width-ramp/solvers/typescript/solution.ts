export class Solution {
    maxWidthRamp(nums: number[]): number {
        const stack: number[] = [];
        for (let i = 0; i < nums.length; i++) {
            if (stack.length === 0 || nums[i] < nums[stack[stack.length - 1]]) {
                stack.push(i);
            }
        }
        let best = 0;
        for (let right = nums.length - 1; right >= 0; right--) {
            while (stack.length > 0 && nums[stack[stack.length - 1]] <= nums[right]) {
                const left = stack.pop() as number;
                best = Math.max(best, right - left);
            }
        }
        return best;
    }
}
