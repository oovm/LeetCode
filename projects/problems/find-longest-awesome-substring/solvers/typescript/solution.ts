export class Solution {
    longestAwesome(s: string): number {
        const first = new Array<number>(1024).fill(Infinity);
        first[0] = -1;
        let mask = 0;
        let best = 0;
        for (let i = 0; i < s.length; i++) {
            mask ^= 1 << (s.charCodeAt(i) - 48);
            best = Math.max(best, i - (first[mask] ?? Infinity));
            for (let d = 0; d < 10; d++) {
                best = Math.max(best, i - (first[mask ^ (1 << d)] ?? Infinity));
            }
            if (first[mask] === Infinity) {
                first[mask] = i;
            }
        }
        return best;
    }
}
