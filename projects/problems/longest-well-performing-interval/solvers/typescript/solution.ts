export class Solution {
    longestWPI(hours: number[]): number {
        const firstPosition = new Map<number, number>();
        let score = 0;
        let best = 0;
        hours.forEach((value, index) => {
            score += value > 8 ? 1 : -1;
            if (score > 0) {
                best = index + 1;
            } else if (firstPosition.has(score - 1)) {
                const previous = firstPosition.get(score - 1)!;
                best = Math.max(best, index - previous);
            }
            if (!firstPosition.has(score)) {
                firstPosition.set(score, index);
            }
        });
        return best;
    }
}
