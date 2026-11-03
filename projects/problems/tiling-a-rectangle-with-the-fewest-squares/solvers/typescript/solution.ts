export class Solution {
    tilingRectangle(n: number, m: number): number {
        const heights = new Array<number>(m).fill(0);
        let best = n * m;
        const dfs = (used: number): void => {
            if (used >= best) {
                return;
            }
            const low = Math.min(...heights);
            if (low === n) {
                best = used;
                return;
            }
            let col = heights.indexOf(low);
            let end = col;
            while (end + 1 < m && heights[end + 1] === low && end - col + 1 + low < n + 1) {
                end += 1;
            }
            for (let width = end - col + 1; width >= 1; width--) {
                for (let c = col; c < col + width; c++) {
                    heights[c] += width;
                }
                dfs(used + 1);
                for (let c = col; c < col + width; c++) {
                    heights[c] -= width;
                }
            }
        };
        dfs(0);
        return best;
    }
}
