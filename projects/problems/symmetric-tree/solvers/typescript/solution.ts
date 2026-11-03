export class Solution {
    isSymmetric(root: (number | null)[]): boolean {
        const mirror = (a: number, b: number): boolean => {
            const va = a < root.length ? root[a] : undefined;
            const vb = b < root.length ? root[b] : undefined;
            if (va == null || vb == null) return va == null && vb == null;
            return va === vb && mirror(2 * a + 1, 2 * b + 2) && mirror(2 * a + 2, 2 * b + 1);
        };
        return root.length === 0 || mirror(1, 2);
    }
}
