export class Solution {
    checkIfPrerequisite(numCourses: number, prerequisites: number[][], queries: number[][]): boolean[] {
        const reachable: boolean[][] = Array.from(
            { length: numCourses },
            () => new Array<boolean>(numCourses).fill(false),
        );
        for (const [before, after] of prerequisites) {
            reachable[before][after] = true;
        }
        for (let course = 0; course < numCourses; course += 1) reachable[course][course] = true;

        for (let middle = 0; middle < numCourses; middle += 1) {
            for (let source = 0; source < numCourses; source += 1) {
                if (source !== middle && reachable[source][middle]) {
                    for (let target = 0; target < numCourses; target += 1) {
                        if (reachable[middle][target]) reachable[source][target] = true;
                    }
                }
            }
        }

        return queries.map(([before, after]) => reachable[before][after]);
    }
}
