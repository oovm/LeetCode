export class Solution {
    gardenNoAdj(n: number, paths: number[][]): number[] {
        const adjacency: number[][] = Array.from({ length: n }, () => []);
        for (const [a, b] of paths) {
            adjacency[a - 1].push(b - 1);
            adjacency[b - 1].push(a - 1);
        }

        const colors = new Array<number>(n).fill(0);
        for (let garden = 0; garden < n; garden++) {
            const used = new Set<number>();
            for (const neighbor of adjacency[garden]) {
                used.add(colors[neighbor]);
            }
            for (let color = 1; color <= 4; color++) {
                if (!used.has(color)) {
                    colors[garden] = color;
                    break;
                }
            }
        }
        return colors;
    }
}
