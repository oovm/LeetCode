export class Solution {
    largestSumOfAverages(nums: number[], k: number): number {
        const n = nums.length;
        const prefix = new Array<number>(n + 1).fill(0);
        for (let index = 0; index < n; index += 1) {
            prefix[index + 1] = prefix[index] + nums[index];
        }

        let dp = new Array<number>(n).fill(0);
        for (let start = 0; start < n; start += 1) {
            dp[start] = (prefix[n] - prefix[start]) / (n - start);
        }

        for (let groups = 2; groups <= k; groups += 1) {
            const next = new Array<number>(n).fill(0);
            for (let head = 0; head < n; head += 1) {
                for (let split = head + 1; split < n; split += 1) {
                    const candidate = (prefix[split] - prefix[head]) / (split - head) + dp[split];
                    if (candidate > next[head]) {
                        next[head] = candidate;
                    }
                }
            }
            dp = next;
        }
        return dp[0];
    }
}
