export class Solution {
    numKLenSubstrNoRepeats(s: string, k: number): number {
        const counts = new Array<number>(26).fill(0);
        let dupes = 0;
        let total = 0;
        for (let i = 0; i < s.length; i++) {
            const c = s.charCodeAt(i) - 97;
            counts[c] += 1;
            if (counts[c] === 2) dupes += 1;
            if (i >= k) {
                const out = s.charCodeAt(i - k) - 97;
                if (counts[out] === 2) dupes -= 1;
                counts[out] -= 1;
            }
            if (i >= k - 1 && dupes === 0) {
                total += 1;
            }
        }
        return total;
    }
}
