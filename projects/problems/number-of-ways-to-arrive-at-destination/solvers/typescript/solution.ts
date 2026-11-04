export class Solution {
    countPaths(n: number, roads: number[][]): number {
        const modulus = 1000000007;
        const infinity = Number.MAX_SAFE_INTEGER / 4;

        const edgeMap = new Map<number, number>();
        for (const [left, right, duration] of roads) {
            const small = Math.min(left, right);
            const large = Math.max(left, right);
            const key = small * n + large;
            const previous = edgeMap.get(key);
            if (previous === undefined || duration < previous) edgeMap.set(key, duration);
        }

        const adjacency: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
        for (const [key, duration] of edgeMap) {
            const left = Math.floor(key / n);
            const right = key % n;
            adjacency[left].push([right, duration]);
            adjacency[right].push([left, duration]);
        }

        const dist = new Array<number>(n).fill(infinity);
        const ways = new Array<number>(n).fill(0);
        const done = new Array<boolean>(n).fill(false);
        dist[0] = 0;
        ways[0] = 1;

        for (let round = 0; round < n; round += 1) {
            let select = -1;
            let best = infinity;
            for (let cursor = 0; cursor < n; cursor += 1) {
                if (!done[cursor] && dist[cursor] < best) {
                    best = dist[cursor];
                    select = cursor;
                }
            }
            if (select === -1 || best >= infinity) break;
            done[select] = true;
            if (select === n - 1) break;
            for (const [next, duration] of adjacency[select]) {
                const candidate = dist[select] + duration;
                if (candidate < dist[next]) {
                    dist[next] = candidate;
                    ways[next] = ways[select];
                } else if (candidate === dist[next]) {
                    ways[next] = (ways[next] + ways[select]) % modulus;
                }
            }
        }

        return ways[n - 1];
    }
}
