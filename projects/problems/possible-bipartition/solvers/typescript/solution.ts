export class Solution {
    possibleBipartition(n: number, dislikes: number[][]): boolean {
        const graph = Array.from({ length: n + 1 }, () => [] as number[]);
        for (const [a, b] of dislikes) {
            graph[a].push(b);
            graph[b].push(a);
        }
        const color = new Array<number>(n + 1).fill(-1);
        for (let start = 1; start <= n; start++) {
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
