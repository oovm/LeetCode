export class Solution {
    nthSuperUglyNumber(n: number, primes: number[]): number {
        const ugly = [1];
        const index = new Array<number>(primes.length).fill(0);
        while (ugly.length < n) {
            const next = Math.min(...primes.map((p, i) => p * ugly[index[i]]));
            ugly.push(next);
            primes.forEach((p, i) => {
                if (p * ugly[index[i]] === next) index[i]++;
            });
        }
        return ugly[n - 1];
    }
}
