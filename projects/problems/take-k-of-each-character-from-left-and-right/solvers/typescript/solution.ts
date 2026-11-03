export class Solution {
    takeCharacters(s: string, k: number): number {
        const total = [0, 0, 0];
        for (const ch of s) {
            total[ch.charCodeAt(0) - 97] += 1;
        }
        if (total.some((c) => c < k)) {
            return -1;
        }
        const window = [0, 0, 0];
        let best = 0;
        let left = 0;
        for (let right = 0; right < s.length; right++) {
            window[s.charCodeAt(right) - 97] += 1;
            while (window.some((c, i) => c > total[i] - k)) {
                window[s.charCodeAt(left) - 97] -= 1;
                left += 1;
            }
            best = Math.max(best, right - left + 1);
        }
        return s.length - best;
    }
}
