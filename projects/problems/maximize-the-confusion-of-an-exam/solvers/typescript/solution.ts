export class Solution {
    maxConsecutiveAnswers(answerKey: string, k: number): number {
        const longest = (target: string): number => {
            let best = 0;
            let left = 0;
            let flips = 0;
            for (let right = 0; right < answerKey.length; right++) {
                if (answerKey[right] !== target) flips += 1;
                while (flips > k) {
                    if (answerKey[left] !== target) flips -= 1;
                    left += 1;
                }
                best = Math.max(best, right - left + 1);
            }
            return best;
        };
        return Math.max(longest('T'), longest('F'));
    }
}
