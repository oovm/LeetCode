export class Solution {
    eventualSafeNodes(graph: number[][]): number[] {
        const count = graph.length;
        const outDegree = new Array<number>(count).fill(0);
        const reverse: number[][] = [];
        for (let node = 0; node < count; node++) {
            outDegree[node] = graph[node].length;
            reverse.push([]);
        }
        for (let node = 0; node < count; node++) {
            for (const target of graph[node]) {
                if (target >= 0 && target < count) reverse[target].push(node);
            }
        }
        const queue: number[] = [];
        for (let node = 0; node < count; node++) if (outDegree[node] === 0) queue.push(node);
        let head = 0;
        while (head < queue.length) {
            const current = queue[head++];
            for (const source of reverse[current]) {
                outDegree[source]--;
                if (outDegree[source] === 0) queue.push(source);
            }
        }
        const result: number[] = [];
        for (let node = 0; node < count; node++) if (outDegree[node] === 0) result.push(node);
        return result;
    }
}
