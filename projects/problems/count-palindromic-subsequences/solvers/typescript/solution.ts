export class Solution {
    countPalindromes(s: string): number {
        const MOD = 1000000007;
        const n = s.length;
        const digits = [...s].map((c) => c.charCodeAt(0) - 48);
        let total = 0;
        for (let a = 0; a < 10; a++) {
            for (let b = 0; b < 10; b++) {
                const left = new Array<number>(n).fill(0);
                let countA = 0;
                let pairs = 0;
                for (let i = 0; i < n; i++) {
                    left[i] = pairs;
                    if (digits[i] === a) countA += 1;
                    if (digits[i] === b) pairs += countA;
                }
                const right = new Array<number>(n).fill(0);
                countA = 0;
                pairs = 0;
                for (let i = n - 1; i >= 0; i--) {
                    right[i] = pairs;
                    if (digits[i] === a) countA += 1;
                    if (digits[i] === b) pairs += countA;
                }
                for (let i = 2; i < n - 2; i++) {
                    total = (total + left[i] * right[i]) % MOD;
                }
            }
        }
        return total;
    }
}
