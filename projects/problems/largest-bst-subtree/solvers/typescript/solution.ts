export class Solution {
    largestBSTSubtree(root: (number | null)[]): number {
        let best = 0;
        const dfs = (i: number): [number, number, number] => {
            // [size, min, max] of BST rooted here; size -1 if not BST
            if (i >= root.length || root[i] === null) return [0, Infinity, -Infinity];
            const [ls, lmin, lmax] = dfs(2 * i + 1);
            const [rs, rmin, rmax] = dfs(2 * i + 2);
            if (ls >= 0 && rs >= 0 && lmax < root[i]! && root[i]! < rmin) {
                const size = ls + rs + 1;
                best = Math.max(best, size);
                return [size, Math.min(lmin, root[i]!), Math.max(rmax, root[i]!)];
            }
            return [-1, 0, 0];
        };
        dfs(0);
        return best;
    }
}
