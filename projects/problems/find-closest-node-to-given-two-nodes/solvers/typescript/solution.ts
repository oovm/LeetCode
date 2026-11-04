function walkDistances(start: number, edges: number[]): number[] {
    const dist = new Array<number>(edges.length).fill(-1);
    let current = start;
    let steps = 0;
    while (current !== -1 && dist[current] === -1) {
        dist[current] = steps;
        current = edges[current];
        steps += 1;
    }
    return dist;
}

export class Solution {
    closestMeetingNode(edges: number[], node1: number, node2: number): number {
        const first = walkDistances(node1, edges);
        const second = walkDistances(node2, edges);
        let answer = -1;
        let best = Number.POSITIVE_INFINITY;
        for (let index = 0; index < edges.length; index += 1) {
            if (first[index] !== -1 && second[index] !== -1) {
                const current = Math.max(first[index], second[index]);
                if (current < best) {
                    best = current;
                    answer = index;
                }
            }
        }
        return answer;
    }
}
