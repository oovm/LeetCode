function primeFactorSum(x: number): number {
    let sum = 0;
    let rest = x;
    for (let d = 2; d * d <= rest; d++) {
        while (rest % d === 0) {
            sum += d;
            rest /= d;
        }
    }
    return rest > 1 ? sum + rest : sum;
}

export class Solution {
    smallestValue(n: number): number {
        let current = n;
        for (;;) {
            const next = primeFactorSum(current);
            if (next === current) {
                return current;
            }
            current = next;
        }
    }
}
