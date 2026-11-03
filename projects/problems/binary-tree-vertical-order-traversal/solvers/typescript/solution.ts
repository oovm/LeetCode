export class Solution {
    verticalOrder(root: (number | null)[]): number[][] {
        if (root.length === 0 || root[0] === null) return [];
        const columns = new Map<number, number[]>();
        const queue: [number, number][] = [[0, 0]];
        for (let head = 0; head < queue.length; head++) {
            const [i, col] = queue[head];
            if (!columns.has(col)) columns.set(col, []);
            columns.get(col)!.push(root[i]!);
            for (const [child, delta] of [[2 * i + 1, -1], [2 * i + 2, 1]] as const) {
                if (child < root.length && root[child] !== null) queue.push([child, col + delta]);
            }
        }
        return [...columns.keys()].sort((a, b) => a - b).map((c) => columns.get(c)!);
    }
}
