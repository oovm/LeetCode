export class Solution {
    findChampion(n: number, edges: number[][]): number {
        // 冠军定义：没有任何入边的节点，且它必须唯一。
        const indegree: number[] = new Array(n).fill(0);
        for (const edge of edges) {
            indegree[edge[1]] += 1;
        }
        let champion = -1;
        let zeros = 0;
        for (let node = 0; node < n; node += 1) {
            if (indegree[node] === 0) {
                zeros += 1;
                champion = node;
            }
        }
        return zeros === 1 ? champion : -1;
    }
}
