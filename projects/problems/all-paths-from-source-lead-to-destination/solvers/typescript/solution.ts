export class Solution {
    leadsToDestination(n: number, edges: number[][], source: number, destination: number): boolean {
        // 三色 DFS：0 未访问 / 1 在当前路径 / 2 已验证安全。
        // 目标点不能有出边，任何死胡同必须恰好是目标点，回到「在路径」节点即环。
        const graph: number[][] = Array.from({ length: n }, () => []);
        for (const edge of edges) {
            graph[edge[0]].push(edge[1]);
        }
        const color: number[] = new Array(n).fill(0);
        const dfs = (node: number): boolean => {
            if (color[node] === 1) {
                return false;
            }
            if (color[node] === 2) {
                return true;
            }
            const outgoing = graph[node];
            if (node === destination) {
                if (outgoing.length !== 0) {
                    return false;
                }
                color[node] = 2;
                return true;
            }
            if (outgoing.length === 0) {
                return false;
            }
            color[node] = 1;
            for (const next of outgoing) {
                if (!dfs(next)) {
                    return false;
                }
            }
            color[node] = 2;
            return true;
        };
        return dfs(source);
    }
}
