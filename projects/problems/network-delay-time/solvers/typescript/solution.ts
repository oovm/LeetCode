export class Solution {
    networkDelayTime(times: number[][], n: number, k: number): number {
        const infinity = Infinity;
        const dist = new Array<number>(n + 1).fill(infinity);
        dist[k] = 0;
        for (let round = 1; round < n; round++) {
            let changed = false;
            for (const [from, to, weight] of times) {
                if (dist[from] < infinity && dist[from] + weight < dist[to]) {
                    dist[to] = dist[from] + weight;
                    changed = true;
                }
            }
            if (!changed) break;
        }
        let worst = 0;
        for (let node = 1; node <= n; node++) {
            if (dist[node] === infinity) return -1;
            worst = Math.max(worst, dist[node]);
        }
        return worst;
    }
}
