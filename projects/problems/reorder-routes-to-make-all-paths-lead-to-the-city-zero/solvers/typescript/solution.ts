export class Solution {
    minReorder(n: number, connections: number[][]): number {
        const adjacency: Array<Array<[number, number]>> = [];
        for (let node = 0; node < n; node++) adjacency.push([]);
        for (const [from, to] of connections) {
            adjacency[from].push([to, 1]);
            adjacency[to].push([from, 0]);
        }
        const seen = new Array<boolean>(n).fill(false);
        const stack = [0];
        seen[0] = true;
        let reversals = 0;
        while (stack.length > 0) {
            const node = stack.pop()!;
            for (const [next, direction] of adjacency[node]) {
                if (seen[next]) continue;
                seen[next] = true;
                if (direction === 1) reversals++;
                stack.push(next);
            }
        }
        return reversals;
    }
}
