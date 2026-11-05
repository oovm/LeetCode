export class Solution {
    minDeletionSize(strs: string[]): number {
        const rows = strs.length;
        if (rows === 0) {
            return 0;
        }
        const columns = strs[0].length;
        // 语料含行长度不齐的输入（F6），列宽沿用首串长度，越界位置跳过比较。
        const settled = new Array<boolean>(Math.max(0, rows - 1)).fill(false);
        let deletions = 0;
        for (let column = 0; column < columns; column++) {
            let keep = true;
            for (let row = 0; row < rows - 1; row++) {
                if (column >= strs[row].length || column >= strs[row + 1].length) {
                    continue;
                }
                if (!settled[row] && strs[row][column] > strs[row + 1][column]) {
                    keep = false;
                    break;
                }
            }
            if (!keep) {
                deletions++;
                continue;
            }
            for (let row = 0; row < rows - 1; row++) {
                if (column >= strs[row].length || column >= strs[row + 1].length) {
                    continue;
                }
                if (!settled[row] && strs[row][column] < strs[row + 1][column]) {
                    settled[row] = true;
                }
            }
            if (settled.every((value) => value)) {
                break;
            }
        }
        return deletions;
    }
}
