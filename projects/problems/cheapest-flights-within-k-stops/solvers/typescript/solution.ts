export class Solution {
    findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {
        const infinity = Infinity;
        let dist = new Array<number>(n).fill(infinity);
        dist[src] = 0;
        for (let stop = 0; stop <= k; stop++) {
            const next = [...dist];
            for (const [from, to, price] of flights) {
                if (dist[from] < infinity && dist[from] + price < next[to]) next[to] = dist[from] + price;
            }
            dist = next;
        }
        return dist[dst] === infinity ? -1 : dist[dst];
    }
}
