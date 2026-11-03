export class Solution {
    maxNumberOfApples(weight: number[]): number {
        const sorted = [...weight].sort((a, b) => a - b);
        let total = 0;
        let count = 0;
        for (const w of sorted) {
            if (total + w > 5000) break;
            total += w;
            count++;
        }
        return count;
    }
}
