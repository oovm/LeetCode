export class Solution {
    regionsBySlashes(grid: string[]): number {
        const count = grid.length;
        if (count === 0) return 0;
        const total = count * count * 4;
        const parent = new Array<number>(total).fill(0).map((_, index) => index);
        let groups = total;

        const find = (value: number): number => {
            let root = value;
            while (parent[root] !== root) root = parent[root];
            let cursor = value;
            while (parent[cursor] !== root) {
                const next = parent[cursor];
                parent[cursor] = root;
                cursor = next;
            }
            return root;
        };
        const join = (left: number, right: number): void => {
            const a = find(left);
            const b = find(right);
            if (a !== b) {
                parent[a] = b;
                groups -= 1;
            }
        };

        for (let row = 0; row < count; row += 1) {
            const text = grid[row];
            for (let col = 0; col < text.length; col += 1) {
                const cell = row * count + col;
                const base = cell * 4;
                if (row + 1 < count) join(base + 2, (cell + count) * 4);
                if (col + 1 < count) join(base + 1, (cell + 1) * 4 + 3);
                const mark = text[col];
                if (mark === '/') {
                    join(base, base + 3);
                    join(base + 1, base + 2);
                } else if (mark === '\\') {
                    join(base, base + 1);
                    join(base + 2, base + 3);
                } else {
                    join(base, base + 1);
                    join(base + 1, base + 2);
                    join(base + 2, base + 3);
                }
            }
        }

        return groups;
    }
}
