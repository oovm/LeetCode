export class Solution {
    findLeaves(root: (number | null)[]): number[][] {
        const result: number[][] = [];
        const height = (i: number): number => {
            if (i >= root.length || root[i] === null) return 0;
            const h = Math.max(height(2 * i + 1), height(2 * i + 2)) + 1;
            if (result.length < h) result.push([]);
            result[h - 1].push(root[i]!);
            return h;
        };
        height(0);
        return result;
    }
}
