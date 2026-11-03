export class Solution {
    isUnivalTree(root: (number | null)[]): boolean {
        if (root.length === 0) return true;
        const target = root[0];
        return root.every((v) => v === null || v === target);
    }
}
