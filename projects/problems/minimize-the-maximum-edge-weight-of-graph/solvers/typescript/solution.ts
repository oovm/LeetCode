export class Solution {
    minMaxWeight(n: number, edges: number[][], threshold: number): number {
        // 先反向建图，再对「最大边权上限」二分：反向图上从 0 能到达全部节点，
        // 等价于原图上每个节点都能用不超过该上限的边走到 0。
        const reversed: number[][][] = [];
        for (let node = 0; node < n; node += 1) reversed.push([]);
        let maxWeight = 0;
        for (const [from, to, weight] of edges) {
            // 参考实现按 edges[i][1] 建反向邻接表，越界节点会抛错，这里保持同一语义。
            if (to >= n) throw new Error('list index out of range');
            reversed[to].push([from, weight]);
            if (weight > maxWeight) maxWeight = weight;
        }

        const coversAll = (limit: number): boolean => {
            const seen = new Array<boolean>(n).fill(false);
            seen[0] = true;
            const queue: number[] = [0];
            let head = 0;
            let reached = 1;
            while (head < queue.length) {
                const node = queue[head];
                head += 1;
                for (const [next, weight] of reversed[node]) {
                    if (weight > limit || seen[next]) continue;
                    seen[next] = true;
                    reached += 1;
                    queue.push(next);
                }
            }
            return reached === n;
        };

        if (!coversAll(maxWeight)) return -1;
        let low = 1;
        let high = maxWeight;
        while (low < high) {
            const middle = Math.floor((low + high) / 2);
            if (coversAll(middle)) high = middle;
            else low = middle + 1;
        }
        return low;
    }
}
