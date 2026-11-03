export class Solution {
    secondsToRemoveOccurrences(s: string): number {
        let seconds = 0;
        let zeros = 0;
        for (const ch of s) {
            if (ch === '0') {
                zeros += 1;
            } else if (zeros > 0) {
                seconds = Math.max(seconds + 1, zeros);
            }
        }
        return seconds;
    }
}
