export class Solution {
    findMissingAndRepeatedValues(grid: number[][]): number[] {
        const n = grid.length;
        const count = new Array<number>(n * n + 1).fill(0);
        for (const row of grid) for (const x of row) count[x]++;
        let repeated = 0;
        let missing = 0;
        for (let v = 1; v <= n * n; v++) {
            if (count[v] === 2) repeated = v;
            if (count[v] === 0) missing = v;
        }
        return [repeated, missing];
    }
}
