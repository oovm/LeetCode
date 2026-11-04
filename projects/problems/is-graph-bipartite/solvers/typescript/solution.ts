export class Solution {
    isBipartite(graph: number[][]): boolean {
        const n = graph.length;
        const color = new Array<number>(n).fill(-1);
        for (let start = 0; start < n; start++) {
            if (color[start] !== -1) continue;
            color[start] = 0;
            const queue: number[] = [start];
            for (let head = 0; head < queue.length; head++) {
                const current = queue[head];
                const wanted = 1 - color[current];
                for (const next of graph[current]) {
                    if (color[next] === -1) {
                        color[next] = wanted;
                        queue.push(next);
                    } else if (color[next] !== wanted) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
