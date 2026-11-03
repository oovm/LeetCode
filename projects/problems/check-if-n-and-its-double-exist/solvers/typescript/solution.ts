export class Solution {
    checkIfExist(arr: number[]): boolean {
        const seen = new Set<number>();
        for (const v of arr) {
            if (seen.has(2 * v) || (v % 2 === 0 && seen.has(v / 2))) return true;
            seen.add(v);
        }
        return false;
    }
}
