export class Solution {
    sumOfLeftLeaves(root: (number | null)[]): number {
        let sum = 0;
        const walk = (i: number, isLeft: boolean): void => {
            if (i >= root.length || root[i] === null) return;
            const hasLeft = 2 * i + 1 < root.length && root[2 * i + 1] !== null;
            const hasRight = 2 * i + 2 < root.length && root[2 * i + 2] !== null;
            if (isLeft && !hasLeft && !hasRight) {
                sum += root[i]!;
                return;
            }
            walk(2 * i + 1, true);
            walk(2 * i + 2, false);
        };
        walk(0, false);
        return sum;
    }
}
