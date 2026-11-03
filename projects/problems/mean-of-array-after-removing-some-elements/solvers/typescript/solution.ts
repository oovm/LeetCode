export class Solution {
    trimMean(arr: number[]): number {
        const sorted = [...arr].sort((a, b) => a - b);
        const cut = sorted.length / 20;
        let sum = 0;
        for (let i = cut; i < sorted.length - cut; i++) sum += sorted[i];
        return sum / (sorted.length - 2 * cut);
    }
}
