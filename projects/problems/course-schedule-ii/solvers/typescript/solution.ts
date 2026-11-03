export class Solution {
    findOrder(numCourses: number, prerequisites: number[][]): number[] {
        const indeg = new Array<number>(numCourses).fill(0);
        const adj: number[][] = Array.from({ length: numCourses }, () => []);
        for (const [course, pre] of prerequisites) {
            adj[pre].push(course);
            indeg[course]++;
        }
        const queue = indeg.flatMap((d, i) => (d === 0 ? [i] : []));
        const order: number[] = [];
        for (let head = 0; head < queue.length; head++) {
            order.push(queue[head]);
            for (const next of adj[queue[head]]) {
                if (--indeg[next] === 0) queue.push(next);
            }
        }
        return order.length === numCourses ? order : [];
    }
}
