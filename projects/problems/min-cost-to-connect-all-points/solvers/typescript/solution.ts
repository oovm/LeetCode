export class Solution {
    minCostConnectPoints(points: number[][]): number {
        // 稠密图 Prim：每轮线性挑选距离生成树最近的未访问点，无需堆。
        const n = points.length;
        const used = new Array<boolean>(n).fill(false);
        const best = new Array<number>(n).fill(Number.MAX_SAFE_INTEGER);
        best[0] = 0;
        let total = 0;
        for (let round = 0; round < n; round += 1) {
            let pick = -1;
            for (let node = 0; node < n; node += 1) {
                if (!used[node] && (pick === -1 || best[node] < best[pick])) pick = node;
            }
            if (pick === -1) break;
            used[pick] = true;
            total += best[pick];
            const x = points[pick][0];
            const y = points[pick][1];
            for (let other = 0; other < n; other += 1) {
                if (used[other]) continue;
                const distance = Math.abs(x - points[other][0]) + Math.abs(y - points[other][1]);
                if (distance < best[other]) best[other] = distance;
            }
        }
        return total;
    }
}
