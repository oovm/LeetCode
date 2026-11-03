export class Solution {
    minimumTimeToInitialState(k: number, word: string): number {
        const n = word.length;
        const z = new Array<number>(n).fill(0);
        let lo = 0;
        let hi = 0;
        for (let i = 1; i < n; i++) {
            if (i <= hi) z[i] = Math.min(hi - i + 1, z[i - lo]);
            while (i + z[i] < n && word[z[i]] === word[i + z[i]]) z[i] += 1;
            if (i + z[i] - 1 > hi) {
                lo = i;
                hi = i + z[i] - 1;
            }
        }
        for (let t = 1; t * k < n; t++) {
            if (z[t * k] >= n - t * k) {
                return t;
            }
        }
        return Math.ceil(n / k);
    }
}
