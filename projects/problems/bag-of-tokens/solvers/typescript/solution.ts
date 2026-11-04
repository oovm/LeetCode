export class Solution {
    bagOfTokensScore(tokens: number[], power: number): number {
        const ordered = [...tokens].sort((a, b) => a - b);
        let low = 0;
        let high = ordered.length - 1;
        let energy = power;
        let score = 0;
        let best = 0;
        while (low <= high) {
            if (energy >= ordered[low]) {
                energy -= ordered[low];
                score += 1;
                low += 1;
                best = Math.max(best, score);
            } else if (score > 0) {
                energy += ordered[high];
                score -= 1;
                high -= 1;
            } else {
                break;
            }
        }
        return best;
    }
}
