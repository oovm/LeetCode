export class Solution {
    findLHS(nums: number[]): number {
        const counts = new Map<number, number>();
        for (const value of nums) counts.set(value, (counts.get(value) ?? 0) + 1);
        let best = 0;
        for (const [value, count] of counts) {
            const next = counts.get(value + 1);
            if (next !== undefined) best = Math.max(best, count + next);
        }
        return best;
    }
}
