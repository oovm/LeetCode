export class Solution {
    maxEqualRowsAfterFlips(matrix: number[][]): number {
        const counts = new Map<string, number>();
        let best = 0;
        for (const row of matrix) {
            const shift = row[0];
            let key = '';
            for (const value of row) {
                key += String(value ^ shift);
            }
            const next = (counts.get(key) ?? 0) + 1;
            counts.set(key, next);
            if (next > best) {
                best = next;
            }
        }
        return best;
    }
}
