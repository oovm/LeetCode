export class Solution {
    largestDivisibleSubset(nums: number[]): number[] {
        if (nums.length === 0) return [];
        nums.sort((a, b) => a - b);
        const size = new Array<number>(nums.length).fill(1);
        const prev = new Array<number>(nums.length).fill(-1);
        let best = 0;
        for (let i = 0; i < nums.length; i++) {
            for (let j = 0; j < i; j++) {
                if (nums[i] % nums[j] === 0 && size[j] + 1 > size[i]) {
                    size[i] = size[j] + 1;
                    prev[i] = j;
                }
            }
            if (size[i] > size[best]) best = i;
        }
        const result: number[] = [];
        for (let i = best; i >= 0; i = prev[i]) result.push(nums[i]);
        return result;
    }
}
