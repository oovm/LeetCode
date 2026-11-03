export class Solution {
    canFinish(numCourses: number, prerequisites: number[][]): boolean {
        const indeg = new Array<number>(numCourses).fill(0);
        const adj: number[][] = Array.from({ length: numCourses }, () => []);
        for (const [course, pre] of prerequisites) {
            adj[pre].push(course);
            indeg[course]++;
        }
        const queue = indeg.flatMap((d, i) => (d === 0 ? [i] : []));
        let done = 0;
        for (let head = 0; head < queue.length; head++) {
            done++;
            for (const next of adj[queue[head]]) {
                if (--indeg[next] === 0) queue.push(next);
            }
        }
        return done === numCourses;
    }
}
