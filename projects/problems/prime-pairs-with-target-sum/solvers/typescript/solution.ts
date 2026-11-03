export class Solution {
    findPrimePairs(n: number): number[][] {
        const prime = new Uint8Array(n + 1).fill(1);
        if (n >= 0) prime[0] = 0;
        if (n >= 1) prime[1] = 0;
        for (let factor = 2; factor * factor <= n; factor++) {
            if (prime[factor]) {
                for (let multiple = factor * factor; multiple <= n; multiple += factor) prime[multiple] = 0;
            }
        }
        const answer: number[][] = [];
        for (let a = 2; a <= n / 2; a++) {
            if (prime[a] && prime[n - a]) answer.push([a, n - a]);
        }
        return answer;
    }
}
