function countDigitLe(n: number, d: number): number {
    if (n < 1) {
        return 0;
    }
    let total = 0;
    for (let w = 1; w <= n; w *= 10) {
        const high = Math.floor(n / (w * 10));
        const cur = Math.floor(n / w) % 10;
        const low = n % w;
        if (d === 0) {
            if (high > 0) {
                total += cur === 0 ? (high - 1) * w + low + 1 : (high - 1) * w + w;
            }
        } else if (cur > d) {
            total += (high + 1) * w;
        } else if (cur === d) {
            total += high * w + low + 1;
        } else {
            total += high * w;
        }
    }
    return total;
}

export class Solution {
    digitsCount(d: number, low: number, high: number): number {
        return countDigitLe(high, d) - countDigitLe(low - 1, d);
    }
}
