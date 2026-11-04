export class Solution {
    findTilt(root: (number | null)[]): number {
        let total = 0;
        const subtreeSum = (i: number): number => {
            if (i >= root.length || root[i] === null) return 0;
            const left = subtreeSum(2 * i + 1);
            const right = subtreeSum(2 * i + 2);
            total += Math.abs(left - right);
            return left + right + root[i]!;
        };
        subtreeSum(0);
        return total;
    }
}
