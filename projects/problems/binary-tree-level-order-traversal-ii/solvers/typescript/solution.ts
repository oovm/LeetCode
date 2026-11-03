export class Solution {
    levelOrderBottom(root: (number | null)[]): number[][] {
        if (root.length === 0 || root[0] === null) return [];
        const result: number[][] = [];
        let level = [0];
        while (level.length > 0) {
            const values: number[] = [];
            const next: number[] = [];
            for (const i of level) {
                values.push(root[i]!);
                for (const child of [2 * i + 1, 2 * i + 2]) {
                    if (child < root.length && root[child] !== null) next.push(child);
                }
            }
            result.unshift(values);
            level = next;
        }
        return result;
    }
}
