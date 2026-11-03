export class Solution {
    inorderTraversal(root: (number | null)[]): number[] {
        const out: number[] = [];
        const walk = (i: number): void => {
            if (i >= root.length || root[i] === null) return;
            walk(2 * i + 1);
            out.push(root[i]!);
            walk(2 * i + 2);
        };
        walk(0);
        return out;
    }
}
