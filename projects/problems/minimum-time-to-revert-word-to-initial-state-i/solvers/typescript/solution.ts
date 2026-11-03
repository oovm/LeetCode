export class Solution {
    minimumTimeToInitialState(k: number, word: string): number {
        const n = word.length;
        const fail = new Array<number>(n).fill(0);
        for (let i = 1, j = 0; i < n; i++) {
            while (j > 0 && word[i] !== word[j]) j = fail[j - 1];
            if (word[i] === word[j]) j += 1;
            fail[i] = j;
        }
        let period = n - fail[n - 1];
        if (n % period !== 0) {
            period = n;
        }
        return Math.ceil(period / k);
    }
}
