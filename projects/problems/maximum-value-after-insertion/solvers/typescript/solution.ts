export class Solution {
    maxValue(x: number, n: string): string {
        const digit = String(Math.abs(x));
        const negative = n[0] === '-';
        let i = negative ? 1 : 0;
        while (i < n.length && (negative ? n[i] <= digit : n[i] >= digit)) {
            i += 1;
        }
        return n.slice(0, i) + digit + n.slice(i);
    }
}
