export class Solution {
    getMaximumXor(nums: number[], maximumBit: number): number[] {
        const mask = (1 << maximumBit) - 1;
        let total = 0;
        for (const x of nums) total ^= x;
        const answer: number[] = [];
        for (let i = nums.length - 1; i >= 0; i--) {
            answer.push(total ^ mask);
            total ^= nums[i];
        }
        return answer;
    }
}
