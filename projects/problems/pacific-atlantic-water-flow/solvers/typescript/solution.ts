export class Solution {
    pacificAtlantic(heights: number[][]): number[][] {
        const m = heights.length;
        const n = heights[0].length;
        const flow = (starts: number[][]): boolean[][] => {
            const reach = Array.from({ length: m }, () => new Array<boolean>(n).fill(false));
            const stack = [...starts];
            while (stack.length > 0) {
                const [i, j] = stack.pop()!;
                if (reach[i][j]) continue;
                reach[i][j] = true;
                for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                    const ni = i + di;
                    const nj = j + dj;
                    if (ni >= 0 && ni < m && nj >= 0 && nj < n && heights[ni][nj] >= heights[i][j]) {
                        stack.push([ni, nj]);
                    }
                }
            }
            return reach;
        };
        const pacific = flow([
            ...Array.from({ length: m }, (_, i) => [i, 0]),
            ...Array.from({ length: n }, (_, j) => [0, j]),
        ]);
        const atlantic = flow([
            ...Array.from({ length: m }, (_, i) => [i, n - 1]),
            ...Array.from({ length: n }, (_, j) => [m - 1, j]),
        ]);
        const result: number[][] = [];
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (pacific[i][j] && atlantic[i][j]) result.push([i, j]);
            }
        }
        return result;
    }
}
