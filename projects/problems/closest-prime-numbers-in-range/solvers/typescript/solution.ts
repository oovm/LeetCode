export class Solution {
    closestPrimes(left: number, right: number): number[] {
        const prime = new Uint8Array(right + 1).fill(1);
        if (right >= 0) prime[0] = 0;
        if (right >= 1) prime[1] = 0;
        for (let factor = 2; factor * factor <= right; factor++) {
            if (prime[factor]) {
                for (let multiple = factor * factor; multiple <= right; multiple += factor) prime[multiple] = 0;
            }
        }
        let previous = -1;
        let best = 0;
        let first = -1;
        let second = -1;
        for (let value = left; value <= right; value++) {
            if (prime[value]) {
                if (previous >= 0) {
                    const gap = value - previous;
                    if (best === 0 || gap < best) {
                        best = gap;
                        first = previous;
                        second = value;
                    }
                }
                previous = value;
            }
        }
        return [first, second];
    }
}
