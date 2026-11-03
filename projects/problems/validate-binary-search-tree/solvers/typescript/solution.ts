export class Solution {
    isValidBST(root: (number | null)[]): boolean {
        const check = (i: number, lo: number, hi: number): boolean => {
            if (i >= root.length || root[i] === null) return true;
            const v = root[i]!;
            if (v <= lo || v >= hi) return false;
            return check(2 * i + 1, lo, v) && check(2 * i + 2, v, hi);
        };
        return check(0, -Infinity, Infinity);
    }
}
