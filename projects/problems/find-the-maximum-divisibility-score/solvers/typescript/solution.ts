export class Solution {
    maxDivScore(nums: number[], divisors: number[]): number {
        let bestDivisor = divisors[0];
        let bestScore = -1;
        for (const d of divisors) {
            let score = 0;
            for (const x of nums) if (x % d === 0) score++;
            if (score > bestScore || (score === bestScore && d < bestDivisor)) {
                bestScore = score;
                bestDivisor = d;
            }
        }
        return bestDivisor;
    }
}
