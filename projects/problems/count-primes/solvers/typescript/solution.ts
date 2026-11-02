export class Solution {
    countPrimes(n: number): number {
        const primes = new Array<boolean>(n).fill(true);
        let ans = 0;
        for (let i = 2; i < n; i++) {
            if (primes[i]) {
                ans++;
                for (let j = i + i; j < n; j += i) {
                    primes[j] = false;
                }
            }
        }
        return ans;
    }
}
