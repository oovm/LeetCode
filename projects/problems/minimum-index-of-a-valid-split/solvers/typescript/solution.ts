export class Solution {
    minimumIndex(nums: number[]): number {
        const counts = new Map<number, number>();
        for (const value of nums) counts.set(value, (counts.get(value) ?? 0) + 1);
        let dominant = nums[0];
        let top = 0;
        for (const [value, amount] of counts) {
            if (amount > top) {
                top = amount;
                dominant = value;
            }
        }
        let left = 0;
        const n = nums.length;
        for (let i = 0; i < n; i += 1) {
            if (nums[i] === dominant) {
                left += 1;
                if (left * 2 > i + 1 && (top - left) * 2 > n - i - 1) return i;
            }
        }
        return -1;
    }
}
