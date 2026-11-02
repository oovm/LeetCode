function isPrime(x: number): boolean {
    if (x < 2) {
        return false;
    }
    for (let d = 2; d * d <= x; d += 1) {
        if (x % d === 0) {
            return false;
        }
    }
    return true;
}

function factorialMod(x: number, m: number): number {
    let r = 1;
    for (let i = 2; i <= x; i += 1) {
        r = (r * i) % m;
    }
    return r;
}

export class Solution {
    numPrimeArrangements(n: number): number {
        const md = 1000000007;
        let primes = 0;
        for (let i = 2; i <= n; i += 1) {
            if (isPrime(i)) {
                primes += 1;
            }
        }
        return Number((BigInt(factorialMod(primes, md)) * BigInt(factorialMod(n - primes, md))) % BigInt(md));
    }
}
