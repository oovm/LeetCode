export class Solution {
    reachableNodes(n: number, edges: number[][], restricted: number[]): number {
        // 受限节点视为不可进入；从 0 做 DFS 统计可达节点数。
        const blocked = new Array<boolean>(n).fill(false);
        for (const node of restricted) blocked[node] = true;

        const graph: number[][] = new Array<number[]>(n);
        for (let i = 0; i < n; i++) graph[i] = [];
        for (const [left, right] of edges) {
            graph[left].push(right);
            graph[right].push(left);
        }

        const visited = new Array<boolean>(n).fill(false);
        const stack = [0];
        visited[0] = true;
        let reachable = 0;
        while (stack.length > 0) {
            const node = stack.pop()!;
            reachable++;
            for (const next of graph[node]) {
                if (blocked[next] || visited[next]) continue;
                visited[next] = true;
                stack.push(next);
            }
        }
        return reachable;
    }
}
