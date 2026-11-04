export class Solution {
    numIslands2(m: number, n: number, positions: number[][]): number[] {
        const parent = new Map<number, number>();
        const rank = new Map<number, number>();
        let groups = 0;

        const find = (value: number): number => {
            let root = value;
            while (parent.get(root) !== root) {
                root = parent.get(root)!;
            }
            let current = value;
            while (parent.get(current) !== root) {
                const next = parent.get(current)!;
                parent.set(current, root);
                current = next;
            }
            return root;
        };

        const union = (left: number, right: number): void => {
            const leftRoot = find(left);
            const rightRoot = find(right);
            if (leftRoot === rightRoot) {
                return;
            }
            const leftRank = rank.get(leftRoot)!;
            const rightRank = rank.get(rightRoot)!;
            if (leftRank < rightRank) {
                parent.set(leftRoot, rightRoot);
            } else if (leftRank > rightRank) {
                parent.set(rightRoot, leftRoot);
            } else {
                parent.set(rightRoot, leftRoot);
                rank.set(leftRoot, leftRank + 1);
            }
            groups--;
        };

        const answers: number[] = [];
        for (const [row, column] of positions) {
            const cell = row * n + column;
            if (!parent.has(cell)) {
                parent.set(cell, cell);
                rank.set(cell, 0);
                groups++;
                const neighbours = [
                    [row - 1, column],
                    [row + 1, column],
                    [row, column - 1],
                    [row, column + 1],
                ];
                for (const [r, c] of neighbours) {
                    if (r < 0 || r >= m || c < 0 || c >= n) {
                        continue;
                    }
                    const other = r * n + c;
                    if (parent.has(other)) {
                        union(cell, other);
                    }
                }
            }
            answers.push(groups);
        }
        return answers;
    }
}
