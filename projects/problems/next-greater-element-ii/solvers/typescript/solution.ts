export class Solution {
    nextGreaterElements(nums: number[]): number[] {
        const n = nums.length;
        const result = new Array<number>(n).fill(-1);
        const stack: number[] = [];
        for (let i = 0; i < 2 * n; i++) {
            const x = nums[i % n];
            while (stack.length > 0 && nums[stack[stack.length - 1]] < x) {
                result[stack.pop()!] = x;
            }
            if (i < n) stack.push(i);
        }
        return result;
    }
}
