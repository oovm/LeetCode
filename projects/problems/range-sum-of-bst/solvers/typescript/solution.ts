export class Solution {
    rangeSumBST(root: (number | null)[], low: number, high: number): number {
        let sum = 0;
        const walk = (i: number): void => {
            if (i >= root.length || root[i] === null) return;
            const v = root[i]!;
            if (v >= low && v <= high) sum += v;
            if (v > low) walk(2 * i + 1);
            if (v < high) walk(2 * i + 2);
        };
        walk(0);
        return sum;
    }
}
