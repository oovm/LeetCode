export class Solution {
    findSmallestSetOfVertices(n: number, edges: number[][]): number[] {
        const indegree = new Array<number>(n).fill(0);
        for (const [, to] of edges) indegree[to]++;
        const result: number[] = [];
        for (let i = 0; i < n; i++) {
            if (indegree[i] === 0) result.push(i);
        }
        return result;
    }
}
