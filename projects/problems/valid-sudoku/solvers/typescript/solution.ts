export class Solution {
    isValidSudoku(board: string[][]): boolean {
        const rows = Array.from({ length: 9 }, () => new Set<string>());
        const cols = Array.from({ length: 9 }, () => new Set<string>());
        const boxes = Array.from({ length: 9 }, () => new Set<string>());
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const v = board[i][j];
                if (v === ".") continue;
                const b = Math.floor(i / 3) * 3 + Math.floor(j / 3);
                if (rows[i].has(v) || cols[j].has(v) || boxes[b].has(v)) return false;
                rows[i].add(v);
                cols[j].add(v);
                boxes[b].add(v);
            }
        }
        return true;
    }
}
