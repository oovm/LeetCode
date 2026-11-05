export class Solution {
    orderOfLargestPlusSign(n: number, mines: number[][]): number {
        const grid = new Uint8Array(n * n);
        for (const mine of mines) {
            grid[mine[0] * n + mine[1]] = 1;
        }
        const best = new Int32Array(n * n);
        for (let row = 0; row < n; row++) {
            const base = row * n;
            let left = 0;
            for (let column = 0; column < n; column++) {
                left = grid[base + column] === 1 ? 0 : left + 1;
                best[base + column] = left;
            }
            let right = 0;
            for (let column = n - 1; column >= 0; column--) {
                right = grid[base + column] === 1 ? 0 : right + 1;
                best[base + column] = Math.min(best[base + column], right);
            }
        }
        for (let column = 0; column < n; column++) {
            let up = 0;
            for (let row = 0; row < n; row++) {
                const at = row * n + column;
                up = grid[at] === 1 ? 0 : up + 1;
                best[at] = Math.min(best[at], up);
            }
            let down = 0;
            for (let row = n - 1; row >= 0; row--) {
                const at = row * n + column;
                down = grid[at] === 1 ? 0 : down + 1;
                best[at] = Math.min(best[at], down);
            }
        }
        let answer = 0;
        for (let index = 0; index < n * n; index++) {
            answer = Math.max(answer, best[index]);
        }
        return answer;
    }
}
