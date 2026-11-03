export class Solution {
    minimumTime(s: string): number {
        const n = s.length;
        const left = new Array<number>(n).fill(0);
        left[0] = s[0] === '1' ? 1 : 0;
        for (let i = 1; i < n; i++) {
            left[i] = Math.min(i + 1, left[i - 1] + (s[i] === '1' ? 2 : 0));
        }
        const right = new Array<number>(n).fill(0);
        right[n - 1] = s[n - 1] === '1' ? 1 : 0;
        for (let i = n - 2; i >= 0; i--) {
            right[i] = Math.min(n - i, right[i + 1] + (s[i] === '1' ? 2 : 0));
        }
        let best = Math.min(left[n - 1], right[0]);
        for (let i = 0; i + 1 < n; i++) {
            best = Math.min(best, left[i] + right[i + 1]);
        }
        return best;
    }
}
