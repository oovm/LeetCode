export class Solution {
    isPossibleToSplit(nums: number[]): boolean {
        const count = new Map<number, number>();
        for (const x of nums) {
            const c = (count.get(x) ?? 0) + 1;
            if (c > 2) return false;
            count.set(x, c);
        }
        return true;
    }
}
