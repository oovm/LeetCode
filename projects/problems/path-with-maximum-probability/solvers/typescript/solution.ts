export class Solution {
    maxProbability(n: number, edges: number[][], succProb: number[], start_node: number, end_node: number): number {
        const adjacency: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
        for (let index = 0; index < edges.length; index += 1) {
            const [left, right] = edges[index];
            adjacency[left].push([right, index]);
            adjacency[right].push([left, index]);
        }

        const best = new Array<number>(n).fill(0);
        const visited = new Array<boolean>(n).fill(false);
        best[start_node] = 1;
        if (start_node === end_node) return 1;

        for (let round = 0; round < n; round += 1) {
            let select = -1;
            let top = 0;
            for (let cursor = 0; cursor < n; cursor += 1) {
                if (!visited[cursor] && (select === -1 || best[cursor] > top)) {
                    select = cursor;
                    top = best[cursor];
                }
            }
            if (select === -1 || top <= 0) break;
            visited[select] = true;
            if (select === end_node) break;
            for (const [next, edgeIndex] of adjacency[select]) {
                if (!visited[next]) {
                    const candidate = top * succProb[edgeIndex];
                    if (candidate > best[next]) best[next] = candidate;
                }
            }
        }

        return best[end_node];
    }
}
