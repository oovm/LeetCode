export class Solution {
    widthOfBinaryTree(root: number[]): number {
        const total = root.length;
        let best = 0;
        let level = 0;
        while (true) {
            const first = 2 ** level - 1;
            if (first >= total) {
                break;
            }
            const bound = 2 ** (level + 1) - 1;
            const last = Math.min(bound, total);
            best = Math.max(best, last - first);
            level++;
        }
        return best;
    }
}
