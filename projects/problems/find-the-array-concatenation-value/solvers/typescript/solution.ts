export class Solution {
    findTheArrayConcVal(nums: number[]): number {
        let total = 0;
        for (let i = 0, j = nums.length - 1; i <= j; i++, j--) {
            total += i === j ? nums[i] : Number(String(nums[i]) + String(nums[j]));
        }
        return total;
    }
}
