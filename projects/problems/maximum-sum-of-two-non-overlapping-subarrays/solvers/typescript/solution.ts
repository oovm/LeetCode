export class Solution {
    maxSumTwoNoOverlap(nums: number[], firstLen: number, secondLen: number): number {
        const n = nums.length;
        const prefix = new Array<number>(n + 1).fill(0);
        for (let i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        let best = 0;

        let bestFirst = -Infinity;
        for (let start = firstLen; start + secondLen <= n; start++) {
            bestFirst = Math.max(bestFirst, prefix[start] - prefix[start - firstLen]);
            best = Math.max(best, bestFirst + prefix[start + secondLen] - prefix[start]);
        }

        let bestSecond = -Infinity;
        for (let start = secondLen; start + firstLen <= n; start++) {
            bestSecond = Math.max(bestSecond, prefix[start] - prefix[start - secondLen]);
            best = Math.max(best, bestSecond + prefix[start + firstLen] - prefix[start]);
        }

        return best;
    }
}
