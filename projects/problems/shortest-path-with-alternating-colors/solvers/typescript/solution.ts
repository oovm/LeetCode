export class Solution {
    shortestAlternatingPaths(n: number, redEdges: number[][], blueEdges: number[][]): number[] {
        const red: number[][] = [];
        const blue: number[][] = [];
        for (let node = 0; node < n; node++) {
            red.push([]);
            blue.push([]);
        }
        for (const [from, to] of redEdges) red[from].push(to);
        for (const [from, to] of blueEdges) blue[from].push(to);
        const dist = new Array<number>(n * 2).fill(-1);
        dist[0] = 0;
        dist[1] = 0;
        const queue: number[] = [0, 1];
        let head = 0;
        while (head < queue.length) {
            const state = queue[head++];
            const node = Math.floor(state / 2);
            const color = state % 2;
            const nextColor = 1 - color;
            const targets = nextColor === 0 ? red[node] : blue[node];
            for (const next of targets) {
                const nextState = next * 2 + nextColor;
                if (dist[nextState] !== -1) continue;
                dist[nextState] = dist[state] + 1;
                queue.push(nextState);
            }
        }
        const result: number[] = [];
        for (let node = 0; node < n; node++) {
            const first = dist[node * 2];
            const second = dist[node * 2 + 1];
            if (first === -1) result.push(second);
            else if (second === -1) result.push(first);
            else result.push(Math.min(first, second));
        }
        return result;
    }
}
