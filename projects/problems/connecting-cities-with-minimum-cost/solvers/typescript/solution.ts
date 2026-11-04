export class Solution {
    minimumCost(n: number, connections: number[][]): number {
        const adjacency: Array<Array<[number, number]>> = Array.from({ length: n + 1 }, () => []);
        for (const [left, right, cost] of connections) {
            adjacency[left].push([right, cost]);
            adjacency[right].push([left, cost]);
        }
        const best = new Array<number>(n + 1).fill(Number.POSITIVE_INFINITY);
        const used = new Array<boolean>(n + 1).fill(false);
        best[1] = 0;
        let total = 0;
        let joined = 0;
        for (let round = 0; round < n; round++) {
            let pick = -1;
            for (let node = 1; node <= n; node++) {
                if (!used[node] && (pick === -1 || best[node] < best[pick])) pick = node;
            }
            if (pick === -1 || best[pick] === Number.POSITIVE_INFINITY) break;
            used[pick] = true;
            total += best[pick];
            joined++;
            for (const [next, cost] of adjacency[pick]) {
                if (!used[next] && cost < best[next]) best[next] = cost;
            }
        }
        return joined === n ? total : -1;
    }
}
