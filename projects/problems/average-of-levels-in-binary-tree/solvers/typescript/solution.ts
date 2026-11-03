export class Solution {
    averageOfLevels(root: (number | null)[]): number[] {
        const level = new Map<number, [sum: number, count: number]>();
        const walk = (i: number, depth: number): void => {
            if (i >= root.length || root[i] === null) return;
            const cur = level.get(depth) ?? [0, 0];
            cur[0] += root[i]!;
            cur[1] += 1;
            level.set(depth, cur);
            walk(2 * i + 1, depth + 1);
            walk(2 * i + 2, depth + 1);
        };
        walk(0, 0);
        const depths = [...level.keys()].sort((a, b) => a - b);
        return depths.map((d) => level.get(d)![0] / level.get(d)![1]);
    }
}
