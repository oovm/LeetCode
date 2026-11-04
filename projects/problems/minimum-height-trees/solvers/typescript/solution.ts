export class Solution {
    findMinHeightTrees(n: number, edges: number[][]): number[] {
        // 拓扑剥叶：每轮删掉所有度为 1 的叶子，最后一轮的叶子就是最小高度树的根。
        if (n === 1) return [0];
        const degrees = new Array<number>(n).fill(0);
        const adjacency: number[][] = [];
        for (let node = 0; node < n; node += 1) adjacency.push([]);
        for (const [left, right] of edges) {
            adjacency[left].push(right);
            adjacency[right].push(left);
            degrees[left] += 1;
            degrees[right] += 1;
        }

        const queue: number[] = [];
        for (let node = 0; node < n; node += 1) if (degrees[node] === 1) queue.push(node);

        const answer: number[] = [];
        let head = 0;
        while (head < queue.length) {
            answer.length = 0;
            const levelSize = queue.length - head;
            for (let processed = 0; processed < levelSize; processed += 1) {
                const node = queue[head];
                head += 1;
                answer.push(node);
                for (const neighbor of adjacency[node]) {
                    degrees[neighbor] -= 1;
                    if (degrees[neighbor] === 1) queue.push(neighbor);
                }
            }
        }
        return answer;
    }
}
