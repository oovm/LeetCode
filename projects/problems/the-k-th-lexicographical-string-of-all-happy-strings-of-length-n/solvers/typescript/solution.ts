export class Solution {
    getHappyString(k: number, n: number): string {
        const total = 3 * 2 ** (n - 1);
        if (k > total) {
            return '';
        }
        const out: string[] = [];
        let rest = k - 1;
        for (let pos = 0; pos < n; pos++) {
            const branchSize = 2 ** (n - 1 - pos);
            const choices = ['a', 'b', 'c'].filter((c) => c !== out[pos - 1]);
            const idx = Math.floor(rest / branchSize);
            out.push(choices[idx]);
            rest %= branchSize;
        }
        return out.join('');
    }
}
