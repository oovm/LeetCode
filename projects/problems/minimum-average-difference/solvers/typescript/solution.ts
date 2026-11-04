export class Solution {
    minimumAverageDifference(nums: number[]): number {
        const total = nums.reduce((sum, value) => sum + value, 0);
        let prefix = 0;
        let best = -1;
        let bestIndex = 0;
        for (let i = 0; i < nums.length; i++) {
            prefix += nums[i];
            const leftAverage = Math.floor(prefix / (i + 1));
            const rightAverage =
                i + 1 < nums.length ? Math.floor((total - prefix) / (nums.length - i - 1)) : 0;
            const difference = Math.abs(leftAverage - rightAverage);
            if (best < 0 || difference < best) {
                best = difference;
                bestIndex = i;
            }
        }
        return bestIndex;
    }
}
