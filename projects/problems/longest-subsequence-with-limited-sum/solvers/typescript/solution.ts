export class Solution {
    answerQueries(nums: number[], queries: number[]): number[] {
        nums.sort((a, b) => a - b);
        const prefix: number[] = [0];
        for (const x of nums) prefix.push(prefix[prefix.length - 1] + x);
        return queries.map((q) => {
            let lo = 0;
            let hi = nums.length;
            while (lo < hi) {
                const mid = (lo + hi + 1) >> 1;
                if (prefix[mid] <= q) lo = mid;
                else hi = mid - 1;
            }
            return lo;
        });
    }
}
