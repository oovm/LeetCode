export class Solution {
    minimumSemesters(n: number, relations: number[][]): number {
        // 拓扑排序按层推进：每一层就是可并行修完的一个学期。
        // 最后已修课程数不足 n 说明仍有环，返回 -1。
        const graph: number[][] = Array.from({ length: n + 1 }, () => []);
        const indegree: number[] = new Array(n + 1).fill(0);
        for (const relation of relations) {
            const prev = relation[0];
            const next = relation[1];
            graph[prev].push(next);
            indegree[next] += 1;
        }
        const queue: number[] = [];
        for (let node = 1; node <= n; node += 1) {
            if (indegree[node] === 0) {
                queue.push(node);
            }
        }
        let semesters = 0;
        let studied = 0;
        let head = 0;
        while (head < queue.length) {
            const level = queue.length - head;
            for (let step = 0; step < level; step += 1) {
                const node = queue[head];
                head += 1;
                studied += 1;
                for (const next of graph[node]) {
                    indegree[next] -= 1;
                    if (indegree[next] === 0) {
                        queue.push(next);
                    }
                }
            }
            semesters += 1;
        }
        return studied === n ? semesters : -1;
    }
}
