export class Solution {
    intersection(nums: number[][]): number[] {
        let common = new Set(nums[0]);
        for (let i = 1; i < nums.length; i++) {
            const cur = new Set(nums[i]);
            common = new Set([...common].filter((v) => cur.has(v)));
        }
        return [...common].sort((a, b) => a - b);
    }
}
