export class Solution {
    countOfPairs(n: number, x: number, y: number): number[] {
        const adjacency: number[][] = Array.from({ length: n }, () => []);
        for (let i = 0; i + 1 < n; i++) {
            adjacency[i].push(i + 1);
            adjacency[i + 1].push(i);
        }
        const left = x - 1;
        const right = y - 1;
        if (left !== right) {
            adjacency[left].push(right);
            adjacency[right].push(left);
        }

        const result = new Array<number>(n).fill(0);
        for (let source = 0; source < n; source++) {
            const distance = new Array<number>(n).fill(-1);
            distance[source] = 0;
            const queue: number[] = [source];
            for (let head = 0; head < queue.length; head++) {
                const current = queue[head];
                for (const next of adjacency[current]) {
                    if (distance[next] === -1) {
                        distance[next] = distance[current] + 1;
                        queue.push(next);
                    }
                }
            }
            for (let target = 0; target < n; target++) {
                if (target !== source) {
                    result[distance[target] - 1]++;
                }
            }
        }
        return result;
    }
}
