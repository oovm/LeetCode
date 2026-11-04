export class Solution {
    jobScheduling(startTime: number[], endTime: number[], profit: number[]): number {
        const count = startTime.length;
        if (count === 0) return 0;

        const jobs = startTime
            .map((start, index) => ({ start, end: endTime[index], profit: profit[index] }))
            .sort((a, b) => a.end - b.end || a.start - b.start);

        const dp = new Array<number>(count + 1).fill(0);
        for (let index = 1; index <= count; index++) {
            const job = jobs[index - 1];

            let low = 0;
            let high = index - 1;
            while (low < high) {
                const mid = low + Math.floor((high - low + 1) / 2);
                if (jobs[mid - 1].end <= job.start) low = mid;
                else high = mid - 1;
            }

            const take = job.profit + dp[low];
            dp[index] = Math.max(dp[index - 1], take);
        }
        return dp[count];
    }
}
