export class Solution {
    countNodes(root: (number | null)[]): number {
        if (root.length === 0) return 0;
        let count = 0;
        for (let i = 0; i < root.length; i++) {
            if (root[i] !== null) count++;
        }
        return count;
    }
}
