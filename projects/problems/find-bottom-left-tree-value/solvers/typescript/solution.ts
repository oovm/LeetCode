export class Solution {
    findBottomLeftValue(root: (number | null)[]): number {
        let answer = root[0]!;
        let level = [0];
        while (level.length > 0) {
            answer = root[level[0]]!;
            const next: number[] = [];
            for (const i of level) {
                for (const child of [2 * i + 1, 2 * i + 2]) {
                    if (child < root.length && root[child] !== null) next.push(child);
                }
            }
            level = next;
        }
        return answer;
    }
}
