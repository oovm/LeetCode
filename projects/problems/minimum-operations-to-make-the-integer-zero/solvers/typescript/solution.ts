function popcount(x: number): number {
    let count = 0;
    let rest = x;
    while (rest > 0) {
        count += rest % 2;
        rest = Math.floor(rest / 2);
    }
    return count;
}

export class Solution {
    makeTheIntegerZero(num1: number, num2: number): number {
        for (let k = 1; k <= 60; k++) {
            const t = num1 - k * num2;
            if (t >= k && popcount(t) <= k) {
                return k;
            }
        }
        return -1;
    }
}
