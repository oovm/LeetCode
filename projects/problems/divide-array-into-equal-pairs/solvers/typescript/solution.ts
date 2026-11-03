export class Solution {
    divideArray(nums: number[]): boolean {
        const count = new Map<number, number>();
        for (const v of nums) count.set(v, (count.get(v) ?? 0) + 1);
        for (const c of count.values()) {
            if (c % 2 !== 0) return false;
        }
        return true;
    }
}
