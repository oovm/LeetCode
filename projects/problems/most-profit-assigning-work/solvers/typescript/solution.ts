export class Solution {
    maxProfitAssignment(difficulty: number[], profit: number[], worker: number[]): number {
        const jobs = difficulty.map((value, index) => [value, profit[index]] as [number, number]);
        jobs.sort((a, b) => a[0] - b[0]);
        worker.sort((a, b) => a - b);
        let best = 0;
        let cursor = 0;
        let total = 0;
        for (const ability of worker) {
            while (cursor < jobs.length && jobs[cursor][0] <= ability) {
                best = Math.max(best, jobs[cursor][1]);
                cursor++;
            }
            total += best;
        }
        return total;
    }
}
