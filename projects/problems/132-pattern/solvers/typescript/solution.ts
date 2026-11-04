export class Solution {
    find132pattern(nums: number[]): boolean {
        const stack: number[] = [];
        let third: number | null = null;
        for (let index = nums.length - 1; index >= 0; index--) {
            const value = nums[index];
            if (third !== null && value < third) {
                return true;
            }
            while (stack.length > 0 && stack[stack.length - 1] < value) {
                third = stack.pop() as number;
            }
            stack.push(value);
        }
        return false;
    }
}
