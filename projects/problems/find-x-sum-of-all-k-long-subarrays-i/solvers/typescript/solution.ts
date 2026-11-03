export class Solution {
    findXSum(nums: number[], k: number, x: number): number[] {
        const result: number[] = [];
        for (let i = 0; i + k <= nums.length; i++) {
            const count = new Map<number, number>();
            for (let j = i; j < i + k; j++) count.set(nums[j], (count.get(nums[j]) ?? 0) + 1);
            const top = [...count.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]).slice(0, x);
            result.push(top.reduce((sum, [v, c]) => sum + v * c, 0));
        }
        return result;
    }
}
