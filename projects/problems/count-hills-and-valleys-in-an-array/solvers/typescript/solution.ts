export class Solution {
    countHillValley(nums: number[]): number {
        const compact = nums.filter((v, i) => i === 0 || v !== nums[i - 1]);
        let count = 0;
        for (let i = 1; i + 1 < compact.length; i++) {
            const isHill = compact[i] > compact[i - 1] && compact[i] > compact[i + 1];
            const isValley = compact[i] < compact[i - 1] && compact[i] < compact[i + 1];
            if (isHill || isValley) count++;
        }
        return count;
    }
}
