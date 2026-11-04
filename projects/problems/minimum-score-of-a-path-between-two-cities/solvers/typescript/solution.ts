export class Solution {
    minScore(n: number, roads: number[][]): number {
        const adjacency: Array<Array<Array<number>>> = [];
        for (let node = 0; node <= n; node++) adjacency.push([]);
        for (const [from, to, distance] of roads) {
            adjacency[from].push([to, distance]);
            adjacency[to].push([from, distance]);
        }
        let best = Infinity;
        const seen = new Array<boolean>(n + 1).fill(false);
        const stack = [1];
        seen[1] = true;
        while (stack.length > 0) {
            const node = stack.pop()!;
            for (const [next, distance] of adjacency[node]) {
                best = Math.min(best, distance);
                if (!seen[next]) {
                    seen[next] = true;
                    stack.push(next);
                }
            }
        }
        return best;
    }
}
