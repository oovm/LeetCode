function isPrime(x: number): boolean {
    if (x < 2) {
        return false;
    }
    if (x % 2 === 0) {
        return x === 2;
    }
    if (x % 3 === 0) {
        return x === 3;
    }
    for (let d = 5; d * d <= x; d += 6) {
        if (x % d === 0 || x % (d + 2) === 0) {
            return false;
        }
    }
    return true;
}

export class Solution {
    nonSpecialCount(l: number, r: number): number {
        const hi = Math.floor(Math.sqrt(r));
        const lo = Math.ceil(Math.sqrt(l));
        let primes = 0;
        for (let p = lo; p <= hi; p++) {
            if (isPrime(p)) {
                primes += 1;
            }
        }
        return r - l + 1 - primes;
    }
}
