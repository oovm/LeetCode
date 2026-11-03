export class Solution {
    wiggleSort(nums: number[]): void {
        const sorted = [...nums].sort((a, b) => a - b);
        const mid = (nums.length + 1) >> 1;
        let small = mid - 1;
        let large = nums.length - 1;
        for (let i = 0; i < nums.length; i++) {
            nums[i] = i % 2 === 0 ? sorted[small--] : sorted[large--];
        }
    }
}
