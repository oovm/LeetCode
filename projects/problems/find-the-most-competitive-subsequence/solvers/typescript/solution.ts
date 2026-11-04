export class Solution {
    mostCompetitive(nums: number[], k: number): number[] {
        const removeLimit = nums.length - k;
        let remove = removeLimit;
        const stack: number[] = [];
        for (const value of nums) {
            while (remove > 0 && stack.length > 0 && stack[stack.length - 1] > value) {
                stack.pop();
                remove--;
            }
            stack.push(value);
        }
        while (remove > 0) {
            stack.pop();
            remove--;
        }
        return stack.slice(0, k);
    }
}
