export class Solution {
    checkTree(root: (number | null)[]): boolean {
        return root[0]! === (root[1] ?? 0) + (root[2] ?? 0);
    }
}
