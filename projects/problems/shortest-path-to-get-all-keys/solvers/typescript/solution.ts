export class Solution {
    shortestPathAllKeys(grid: string[]): number {
        const rows = grid.length;
        const cols = grid[0].length;
        let startRow = 0;
        let startCol = 0;
        let keyCount = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const ch = grid[r][c];
                if (ch === "@") {
                    startRow = r;
                    startCol = c;
                }
                if (ch >= "a" && ch <= "f") {
                    keyCount++;
                }
            }
        }
        const allKeys = (1 << keyCount) - 1;
        const seen = new Set<number>();
        const initial: [number, number, number] = [startRow, startCol, 0];
        let queue: [number, number, number][] = [initial];
        seen.add((startRow * cols + startCol) * 64);
        const dr = [-1, 0, 1, 0];
        const dc = [0, 1, 0, -1];
        let steps = 0;
        while (queue.length > 0) {
            const next: [number, number, number][] = [];
            for (const [row, col, mask] of queue) {
                if (mask === allKeys) {
                    return steps;
                }
                for (let direction = 0; direction < 4; direction++) {
                    const nr = row + dr[direction];
                    const nc = col + dc[direction];
                    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
                        continue;
                    }
                    const ch = grid[nr][nc];
                    if (ch === "#") {
                        continue;
                    }
                    let nextMask = mask;
                    if (ch >= "a" && ch <= "f") {
                        nextMask |= 1 << (ch.charCodeAt(0) - 97);
                    }
                    if (ch >= "A" && ch <= "F") {
                        const needed = 1 << (ch.charCodeAt(0) - 65);
                        if ((mask & needed) === 0) {
                            continue;
                        }
                    }
                    const state = (nr * cols + nc) * 64 + nextMask;
                    if (!seen.has(state)) {
                        seen.add(state);
                        next.push([nr, nc, nextMask]);
                    }
                }
            }
            queue = next;
            steps++;
        }
        return -1;
    }
}
