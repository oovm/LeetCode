export class Solution {
    strWithout3a3b(a: number, b: number): string {
        const out: string[] = [];
        while (a > 0 || b > 0) {
            const n = out.length;
            const lastTwo = n >= 2 && out[n - 1] === out[n - 2];
            const pickA = lastTwo ? out[n - 1] === 'b' : a >= b;
            if (pickA && a > 0) {
                out.push('a');
                a -= 1;
            } else if (!pickA && b > 0) {
                out.push('b');
                b -= 1;
            } else if (a > 0) {
                out.push('a');
                a -= 1;
            } else {
                out.push('b');
                b -= 1;
            }
        }
        return out.join('');
    }
}
