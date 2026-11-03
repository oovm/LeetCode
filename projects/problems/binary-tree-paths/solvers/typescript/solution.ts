export class Solution {
    binaryTreePaths(root: (number | null)[]): string[] {
        const out: string[] = [];
        const walk = (i: number, path: string): void => {
            if (i >= root.length || root[i] === null) return;
            const cur = path === "" ? `${root[i]}` : `${path}->${root[i]}`;
            const left = 2 * i + 1;
            const right = 2 * i + 2;
            const hasLeft = left < root.length && root[left] !== null;
            const hasRight = right < root.length && root[right] !== null;
            if (!hasLeft && !hasRight) {
                out.push(cur);
                return;
            }
            walk(left, cur);
            walk(right, cur);
        };
        walk(0, "");
        return out;
    }
}
