export class Solution {
    buttonWithLongestTime(events: number[][]): number {
        let bestId = events[0][0];
        let bestTime = events[0][1];
        for (let i = 1; i < events.length; i++) {
            const time = events[i][1] - events[i - 1][1];
            if (time > bestTime || (time === bestTime && events[i][0] < bestId)) {
                bestTime = time;
                bestId = events[i][0];
            }
        }
        return bestId;
    }
}
