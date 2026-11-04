export class Solution {
    shortestPathLength(graph: number[][]): number {
        const nodes = graph.length;
        const states = 1 << nodes;
        const full = states - 1;
        const visited = new Set<number>();

        let frontier: number[] = [];
        for (let node = 0; node < nodes; node++) {
            const state = node * states + (1 << node);
            visited.add(state);
            frontier.push(state);
        }

        let steps = 0;
        while (frontier.length > 0) {
            const next: number[] = [];
            for (const state of frontier) {
                const mask = state % states;
                const node = Math.floor(state / states);
                if (mask === full) return steps;

                for (const neighbor of graph[node]) {
                    const nextMask = mask | (1 << neighbor);
                    const nextState = neighbor * states + nextMask;
                    if (!visited.has(nextState)) {
                        visited.add(nextState);
                        next.push(nextState);
                    }
                }
            }
            frontier = next;
            steps++;
        }
        return 0;
    }
}
