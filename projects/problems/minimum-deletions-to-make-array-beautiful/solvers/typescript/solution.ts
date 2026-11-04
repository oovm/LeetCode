export class Solution {
    minDeletion(nums: number[]): number {
        const stack: number[] = [];
        for (const value of nums) {
            if (stack.length % 2 === 0) {
                stack.push(value);
            } else if (stack[stack.length - 1] !== value) {
                stack.push(value);
            }
        }
        if (stack.length % 2 === 1) stack.pop();
        return nums.length - stack.length;
    }
}
