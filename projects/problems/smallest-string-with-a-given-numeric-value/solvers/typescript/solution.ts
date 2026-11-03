export class Solution {
    getSmallestString(k: number, n: number): string {
        let rest = k;
        const out = new Array<string>(n).fill('a');
        rest -= n;
        for (let i = n - 1; i >= 0 && rest > 0; i--) {
            const add = Math.min(25, rest);
            out[i] = String.fromCharCode(97 + add);
            rest -= add;
        }
        return out.join('');
    }
}
