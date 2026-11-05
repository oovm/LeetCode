export class Solution {
    longestArithSeqLength(nums: number[]): number {
        let answer = 0;
        const chains = new Map<string, number>();
        for (let right = 1; right < nums.length; right++) {
            for (let left = 0; left < right; left++) {
                const difference = nums[right] - nums[left];
                const here = `${right}:${difference}`;
                const previous = `${left}:${difference}`;
                const length = Math.max(2, (chains.get(previous) ?? 1) + 1);
                const kept = chains.get(here) ?? 1;
                if (length > kept) {
                    chains.set(here, length);
                    answer = Math.max(answer, length);
                }
            }
        }
        return answer;
    }
}
