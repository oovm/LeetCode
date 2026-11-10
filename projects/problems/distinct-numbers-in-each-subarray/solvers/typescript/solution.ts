export class Solution {
    distinctNumbers(nums: number[], k: number): number[] {
        const count = new Map<number, number>();
        for (let i = 0; i < k; i++) {
            count.set(nums[i], (count.get(nums[i]) ?? 0) + 1);
        }
        const out: number[] = [count.size];
        for (let i = k; i < nums.length; i++) {
            count.set(nums[i], (count.get(nums[i]) ?? 0) + 1);
            const left = count.get(nums[i - k])! - 1;
            if (left === 0) count.delete(nums[i - k]);
            else count.set(nums[i - k], left);
            out.push(count.size);
        }
        return out;
    }
}
