export class Solution {
    minScoreTriangulation(values: number[]): number {
        const count = values.length;
        if (count < 3) {
            return 0;
        }
        const table = new Array<number>(count * count).fill(0);
        for (let span = 2; span < count; span++) {
            for (let left = 0; left + span < count; left++) {
                const right = left + span;
                let best = -1;
                for (let middle = left + 1; middle < right; middle++) {
                    const score =
                        table[left * count + middle] +
                        table[middle * count + right] +
                        values[left] * values[middle] * values[right];
                    if (best < 0 || score < best) {
                        best = score;
                    }
                }
                table[left * count + right] = best;
            }
        }
        return table[count - 1];
    }
}
