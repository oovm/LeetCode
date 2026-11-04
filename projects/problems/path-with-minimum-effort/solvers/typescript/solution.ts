export class Solution {
    minimumEffortPath(heights: number[][]): number {
        // 对 effort 阈值二分，再用 BFS 判定该阈值下能否从左上角走到右下角。
        const rows = heights.length;
        const cols = heights[0].length;
        // 参考实现按 heights[0] 的列宽遍历整张表，锯齿行会越界抛错，这里保持同一语义。
        for (let row = 0; row < rows; row += 1) {
            if (heights[row].length < cols) throw new Error('list index out of range');
        }
        const total = rows * cols;
        const reachable = (limit: number): boolean => {
            const visited = new Array<boolean>(total).fill(false);
            visited[0] = true;
            const queue: number[] = [0];
            let head = 0;
            while (head < queue.length) {
                const cell = queue[head];
                head += 1;
                if (cell === total - 1) return true;
                const row = Math.floor(cell / cols);
                const col = cell % cols;
                for (const [drow, dcol] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                    const nextRow = row + drow;
                    const nextCol = col + dcol;
                    if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) continue;
                    if (visited[nextRow * cols + nextCol]) continue;
                    const effort = Math.abs(heights[row][col] - heights[nextRow][nextCol]);
                    if (effort > limit) continue;
                    visited[nextRow * cols + nextCol] = true;
                    queue.push(nextRow * cols + nextCol);
                }
            }
            return false;
        };

        let low = 0;
        let high = 1000000;
        while (low < high) {
            const middle = Math.floor((low + high) / 2);
            if (reachable(middle)) high = middle;
            else low = middle + 1;
        }
        return low;
    }
}
