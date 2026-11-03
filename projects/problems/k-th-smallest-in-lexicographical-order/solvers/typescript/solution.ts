export class Solution {
    findKthNumber(n: number, k: number): number {
        const countWithPrefix = (prefix: number): number => {
            let total = 0;
            let first = prefix;
            let next = prefix + 1;
            while (first <= n) {
                total += Math.min(n + 1, next) - first;
                first *= 10;
                next *= 10;
            }
            return total;
        };
        let current = 1;
        let rest = k - 1;
        while (rest > 0) {
            const steps = countWithPrefix(current);
            if (steps <= rest) {
                rest -= steps;
                current += 1;
            } else {
                rest -= 1;
                current *= 10;
            }
        }
        return current;
    }
}
