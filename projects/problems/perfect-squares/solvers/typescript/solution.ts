function isPerfectSquare(x: number): boolean {
    const r = Math.floor(Math.sqrt(x));
    return r * r === x;
}

export class Solution {
    numSquares(n: number): number {
        if (isPerfectSquare(n)) {
            return 1;
        }
        let m = n;
        while (m % 4 === 0) {
            m /= 4;
        }
        if (m % 8 === 7) {
            return 4;
        }
        for (let a = 0; a * a <= n; a++) {
            if (isPerfectSquare(n - a * a)) {
                return 2;
            }
        }
        return 3;
    }
}
