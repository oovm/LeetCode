export class Solution {
    isCousins(root: (number | null)[], x: number, y: number): boolean {
        const info = new Map<number, [depth: number, parent: number]>();
        const walk = (i: number, depth: number, parent: number): void => {
            if (i >= root.length || root[i] === null) return;
            info.set(root[i]!, [depth, parent]);
            walk(2 * i + 1, depth + 1, root[i]!);
            walk(2 * i + 2, depth + 1, root[i]!);
        };
        walk(0, 0, -1);
        const a = info.get(x)!;
        const b = info.get(y)!;
        return a[0] === b[0] && a[1] !== b[1];
    }
}
