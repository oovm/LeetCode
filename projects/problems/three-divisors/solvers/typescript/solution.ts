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

export class Solution {
    isThree(n: number): boolean {
        const r = Math.round(Math.sqrt(n));
        if (r * r !== n) {
            return false;
        }
        return isPrime(r);
    }
}
