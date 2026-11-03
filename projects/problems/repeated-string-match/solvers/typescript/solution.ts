export class Solution {
    repeatedStringMatch(a: string, b: string): number {
        const base = Math.ceil(b.length / a.length);
        if (a.repeat(base).includes(b)) {
            return base;
        }
        if (a.repeat(base + 1).includes(b)) {
            return base + 1;
        }
        return -1;
    }
}
