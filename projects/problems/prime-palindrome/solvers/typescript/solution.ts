export class Solution {
    primePalindrome(n: number): number {
        const mulMod = (a: number, b: number, m: number): number => {
            let result = 0;
            let x = a % m;
            let y = b;
            while (y > 0) {
                if (y % 2 === 1) result = (result + x) % m;
                x = (x + x) % m;
                y = Math.floor(y / 2);
            }
            return result;
        };
        const powMod = (base: number, exp: number, m: number): number => {
            let result = 1;
            let b = base % m;
            let e = exp;
            while (e > 0) {
                if (e % 2 === 1) result = mulMod(result, b, m);
                b = mulMod(b, b, m);
                e = Math.floor(e / 2);
            }
            return result;
        };
        const witness = (base: number, d: number, r: number, v: number): boolean => {
            let x = powMod(base % v, d, v);
            if (x === 1 || x === v - 1) return true;
            for (let i = 1; i < r; i++) {
                x = mulMod(x, x, v);
                if (x === v - 1) return true;
            }
            return false;
        };
        const isPrime = (v: number): boolean => {
            if (v < 2) return false;
            if (v % 2 === 0) return v === 2;
            let d = v - 1;
            let r = 0;
            while (d % 2 === 0) {
                d /= 2;
                r += 1;
            }
            return [2, 325, 9375, 28178, 450775, 9780504, 1795265022].every((b) => witness(b, d, r, v));
        };
        if (n <= 2) return 2;
        if (n <= 3) return 3;
        if (n <= 5) return 5;
        if (n <= 7) return 7;
        if (n <= 11) return 11;
        let len = String(n).length;
        if (len % 2 === 0) len += 1;
        for (; len <= 15; len += 2) {
            const base = 10 ** ((len - 1) / 2);
            for (let half = base; half < base * 10; half++) {
                let p = half;
                for (let x = Math.floor(half / 10); x > 0; x = Math.floor(x / 10)) {
                    p = p * 10 + (x % 10);
                }
                if (p >= n && isPrime(p)) {
                    return p;
                }
            }
        }
        return -1;
    }
}
