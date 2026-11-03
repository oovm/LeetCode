export class Solution {
    minDeletionSize(strs: string[]): number {
        let removed = 0;
        for (let j = 0; j < strs[0].length; j++) {
            for (let i = 1; i < strs.length; i++) {
                if (strs[i][j] < strs[i - 1][j]) {
                    removed++;
                    break;
                }
            }
        }
        return removed;
    }
}
