export class Solution {
    hardestWorker(n: number, logs: number[][]): number {
        let bestId = logs[0][0];
        let bestTime = logs[0][1];
        for (let i = 1; i < logs.length; i++) {
            const time = logs[i][1] - logs[i - 1][1];
            if (time > bestTime || (time === bestTime && logs[i][0] < bestId)) {
                bestTime = time;
                bestId = logs[i][0];
            }
        }
        return bestId;
    }
}
