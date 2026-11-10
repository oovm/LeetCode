export class Solution {
    getNoZeroIntegers(n: number): number[] {
        const hasZero = (x: number): boolean => {
            let v = x;
            while (v > 0) {
                if (v % 10 === 0) return true;
                v = Math.floor(v / 10);
            }
            return false;
        };
        for (let a = 1; a < n; a++) {
            const b = n - a;
            if (!hasZero(a) && !hasZero(b)) return [a, b];
        }
        return [1, n - 1];
    }
}
