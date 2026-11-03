function between(v: number, lo: number, hi: number): boolean {
    if (lo > hi) {
        return between(v, hi, lo);
    }
    return v > lo && v < hi;
}

export class Solution {
    minMovesToCaptureTheQueen(a: number, b: number, c: number, d: number, e: number, f: number): number {
        if (a === e && !(d === f && between(c, a, e))) {
            return 1;
        }
        if (b === f && !(c === e && between(d, b, f))) {
            return 1;
        }
        const sameDiag = Math.abs(c - e) === Math.abs(d - f);
        if (sameDiag) {
            const rookOnDiag = Math.abs(a - e) === Math.abs(b - f);
            if (!rookOnDiag || !between(a, c, e)) {
                return 1;
            }
        }
        return 2;
    }
}
