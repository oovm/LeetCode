export class Solution {
    networkBecomesIdle(edges: number[][], patience: number[]): number {
        const adjacency = new Map<number, number[]>();
        for (const [a, b] of edges) {
            if (!adjacency.has(a)) adjacency.set(a, []);
            if (!adjacency.has(b)) adjacency.set(b, []);
            adjacency.get(a)!.push(b);
            adjacency.get(b)!.push(a);
        }

        const distance = new Map<number, number>();
        distance.set(0, 0);
        const queue: number[] = [0];
        for (let head = 0; head < queue.length; head++) {
            const current = queue[head];
            for (const next of adjacency.get(current) ?? []) {
                if (!distance.has(next)) {
                    distance.set(next, distance.get(current)! + 1);
                    queue.push(next);
                }
            }
        }

        let answer = 0;
        for (let i = 1; i < queue.length; i++) {
            const node = queue[i];
            if (node >= patience.length) {
                throw new Error("list index out of range");
            }
            const period = patience[node];
            if (period === 0) {
                throw new Error("integer division or modulo by zero");
            }
            const trip = 2 * distance.get(node)!;
            const idle = Math.floor((trip - 1) / period) * period + trip + 1;
            answer = Math.max(answer, idle);
        }
        return answer;
    }
}
