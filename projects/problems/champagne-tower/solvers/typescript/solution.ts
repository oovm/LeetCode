export class Solution {
    champagneTower(queryGlass: number, poured: number, queryRow: number): number {
        let row = [poured];
        for (let r = 0; r < queryRow; r++) {
            const next = new Array<number>(row.length + 1).fill(0);
            for (let c = 0; c < row.length; c++) {
                const overflow = Math.max(0, row[c] - 1) / 2;
                next[c] += overflow;
                next[c + 1] += overflow;
            }
            row = next;
        }
        return Math.min(1, row[queryGlass]);
    }
}
