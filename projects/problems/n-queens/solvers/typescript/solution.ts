export class Solution {
    solveNQueens(n: number): string[][] {
        const results: string[][] = [];
        const placements: number[] = [];
        const columns = new Set<number>();
        const downward = new Set<number>();
        const upward = new Set<number>();

        const place = (row: number): void => {
            if (row === n) {
                const board: string[] = [];
                for (let r = 0; r < n; r++) {
                    let line = "";
                    for (let c = 0; c < n; c++) {
                        line += placements[r] === c ? "Q" : ".";
                    }
                    board.push(line);
                }
                results.push(board);
                return;
            }
            for (let col = 0; col < n; col++) {
                const downSlot = row + n - 1 - col;
                const upSlot = row + col;
                if (columns.has(col) || downward.has(downSlot) || upward.has(upSlot)) {
                    continue;
                }
                columns.add(col);
                downward.add(downSlot);
                upward.add(upSlot);
                placements.push(col);
                place(row + 1);
                placements.pop();
                columns.delete(col);
                downward.delete(downSlot);
                upward.delete(upSlot);
            }
        };

        place(0);
        return results;
    }
}
