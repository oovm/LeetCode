export class Solution {
    maximumLengthSubstring(s: string): number {
        const counts = new Array<number>(26).fill(0);
        let best = 0;
        let left = 0;
        for (let right = 0; right < s.length; right++) {
            counts[s.charCodeAt(right) - 97] += 1;
            while (counts[s.charCodeAt(right) - 97] > 2) {
                counts[s.charCodeAt(left) - 97] -= 1;
                left += 1;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}
