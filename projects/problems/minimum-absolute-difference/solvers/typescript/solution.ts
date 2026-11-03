export class Solution {
    minimumAbsDifference(arr: number[]): number[][] {
        const sorted = [...arr].sort((a, b) => a - b);
        let best = Number.MAX_SAFE_INTEGER;
        for (let i = 1; i < sorted.length; i++) {
            best = Math.min(best, sorted[i] - sorted[i - 1]);
        }
        const out: number[][] = [];
        for (let i = 1; i < sorted.length; i++) {
            if (sorted[i] - sorted[i - 1] === best) {
                out.push([sorted[i - 1], sorted[i]]);
            }
        }
        return out;
    }
}
